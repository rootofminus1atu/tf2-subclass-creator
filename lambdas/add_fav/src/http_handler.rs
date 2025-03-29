use lambda_http::{Body, Error, Request, RequestExt, Response, tracing};
use serde::{Deserialize, Serialize};
use mongodb::{Client, options::ClientOptions};
use bson::{doc, oid::ObjectId, DateTime};
use serde_json;
use futures_util::TryStreamExt;


#[derive(Debug, Serialize, Deserialize)]
struct Loadout {
    #[serde(rename = "_id")]
    id: ObjectId,
    merc: String,
    primary: i32,
    secondary: i32,
    melee: i32,
    name: String,
    playstyle: String,
    #[serde(rename = "userId")]
    user_id: String,
    #[serde(rename = "createdAt")]
    created_at: DateTime,
    #[serde(rename = "updatedAt")]
    updated_at: DateTime,
    favorites: Vec<String>,
}

#[derive(Serialize)]
struct JsonResponse {
    message: String,
}

pub(crate) async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let ctx = event.request_context();
    let user_id = ctx.authorizer()
        .and_then(|auth| auth.fields.get("userId"))
        .and_then(|v| v.as_str())
        .ok_or(Error::from("Unauthorized: No valid user ID found"))?;
    tracing::info!("Request from user: {}", user_id);

    let path_params = event.path_parameters();
    let loadout_id = path_params
        .first("id")
        .ok_or_else(|| Error::from("Missing loadout ID"))?;
    let loadout_id = ObjectId::parse_str(loadout_id).map_err(|_| Error::from("Invalid loadout ID format"))?;

    let client_options = ClientOptions::parse("%MONGO_URI%").await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("tf2sc");
    let loadouts = db.collection::<Loadout>("loadouts");

    let loadout = loadouts.find_one(
        doc! { "_id": loadout_id },
        None
    ).await?.ok_or_else(|| Error::from("Loadout not found"))?;

    let is_favorited = loadout.favorites.contains(&user_id.to_string());
    
    let update_result = if is_favorited {
        loadouts.update_one(
            doc! { "_id": loadout_id },
            doc! {
                "$pull": { "favorites": user_id },
                "$set": { "updatedAt": bson::DateTime::now() }
            },
            None
        ).await?
    } else {
        loadouts.update_one(
            doc! { "_id": loadout_id },
            doc! {
                "$addToSet": { "favorites": user_id },
                "$set": { "updatedAt": bson::DateTime::now() }
            },
            None
        ).await?
    };

    if update_result.modified_count == 0 {
        return Ok(Response::builder()
            .status(500)
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "POST")
            .header("Access-Control-Allow-Headers", "Content-Type,Authorization")
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&JsonResponse {
                message: "Failed to update favorites".to_string()
            })?.into())?);
    }

    Ok(Response::builder()
        .status(200)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "POST")
        .header("Access-Control-Allow-Headers", "Content-Type,Authorization")
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&JsonResponse {
            message: if is_favorited {
                "Removed from favorites"
            } else {
                "Added to favorites"
            }.to_string()
        })?.into())?)
}
