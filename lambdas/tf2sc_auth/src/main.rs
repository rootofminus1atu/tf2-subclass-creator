use lambda_runtime::{service_fn, Error, LambdaEvent, tracing};
use serde::{Deserialize, Serialize};
use jsonwebtoken::{decode, decode_header, jwk::JwkSet, DecodingKey, Validation};
use reqwest::Client;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize
}

#[derive(Serialize, Debug, Clone)]
struct PolicyDocument {
    Version: String,
    Statement: Vec<Statement>,
}

#[derive(Serialize, Debug, Clone)]
struct Statement {
    Action: String,
    Effect: String,
    Resource: String,
}

#[derive(Serialize, Debug, Clone)]
struct AuthResponse {
    principalId: String,
    policyDocument: PolicyDocument,
    #[serde(skip_serializing_if = "Option::is_none")]
    context: Option<Context>
}

#[derive(Serialize, Debug, Clone)]
struct Context {
    userId: String,
    roles: String
}

#[derive(Deserialize, Debug, Clone)]
struct Event {
    #[serde(rename = "authorizationToken")]
    authorization_token: Option<String>,
    #[serde(rename = "methodArn")]
    method_arn: String,
}

async fn function_handler(event: LambdaEvent<Event>) -> Result<AuthResponse, Error> {
    tracing::info!("woa.. token? {:?}", event.payload.authorization_token);

    let token = match event.payload.authorization_token {
        Some(t) if t.starts_with("Bearer ") => t["Bearer ".len()..].to_string(),
        _ => return Ok(deny_access(&event.payload.method_arn))
    };

    let header = match decode_header(&token) {
        Ok(h) => h,
        Err(_) => return Ok(deny_access(&event.payload.method_arn))
    };

    let kid = match header.kid {
        Some(k) => k,
        None => return Ok(deny_access(&event.payload.method_arn))
    };

    let client = Client::new();
    let jwks = match client.get("https://dev-fg28cspzvpoubaeb.us.auth0.com/.well-known/jwks.json")
        .send()
        .await?
        .json::<JwkSet>()
        .await {
            Ok(j) => j,
            Err(_) => return Ok(deny_access(&event.payload.method_arn))
        };

    let jwk = match jwks.find(&kid) {
        Some(k) => k,
        None => return Ok(deny_access(&event.payload.method_arn))
    };

    // Verify JWT
    let decoding_key = match DecodingKey::from_jwk(jwk) {
        Ok(dk) => dk,
        Err(_) => return Ok(deny_access(&event.payload.method_arn))
    };

    let mut validation = Validation::new(header.alg);
    validation.set_audience(&["https://tf2scapi"]);


    match decode::<Claims>(&token, &decoding_key, &validation) {
        Ok(token_data) => {
            tracing::info!("{:?}", token_data);

            // hardcoded for now because auth0 wont let me add a machine to machine trigger (free account moment)
            let roles = if ["%ADMIN_ID%"].contains(&token_data.claims.sub.as_str()) {
                tracing::info!("was admin!!!");
                vec!["admin"]
            } else {
                vec![]
            };

            Ok(AuthResponse {
                principalId: token_data.claims.sub.clone(),
                policyDocument: PolicyDocument {
                    Version: "2012-10-17".to_string(),
                    Statement: vec![Statement {
                        Action: "execute-api:Invoke".to_string(),
                        Effect: "Allow".to_string(),
                        Resource: format!("{}/POST/*", event.payload.method_arn.split("/POST/").next().unwrap_or("")),
                    }],
                },
                context: Some(Context {
                    userId: token_data.claims.sub.clone(),
                    roles: roles.join(",")
                }),
            })
        },
        Err(e) => {
            tracing::info!("oh no prob couldnt decode: {}", e);
            Ok(deny_access(&event.payload.method_arn))
        }
    }
}

fn deny_access(method_arn: &str) -> AuthResponse {
    AuthResponse {
        principalId: "unauthorized".to_string(),
        policyDocument: PolicyDocument {
            Version: "2012-10-17".to_string(),
            Statement: vec![Statement {
                Action: "execute-api:Invoke".to_string(),
                Effect: "Deny".to_string(),
                Resource: format!("{}/POST/*", method_arn.split("/POST/").next().unwrap_or("")),
            }],
        },
        context: None,
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();
    lambda_runtime::run(service_fn(function_handler)).await
}