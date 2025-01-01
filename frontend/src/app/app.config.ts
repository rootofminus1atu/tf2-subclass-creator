import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';

const AUDIENCE = 'https://tf2scapi'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain: 'dev-fg28cspzvpoubaeb.us.auth0.com',
      clientId: 'BZL2l9tIRFMDTjyS4eBwan7SsLXNNIqB',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: AUDIENCE
      },
      httpInterceptor: {
        allowedList: [
          // {
          //   // Match any request that starts 'https://dev-fg28cspzvpoubaeb.us.auth0.com/api/v2/' (note the asterisk)
          //   uri: 'https://dev-fg28cspzvpoubaeb.us.auth0.com/api/v2/*',
          //   tokenOptions: {
          //     authorizationParams: {
          //       // The attached token should target this audience
          //       audience: 'https://dev-fg28cspzvpoubaeb.us.auth0.com/api/v2/',
  
          //     }
          //   }
          // },
          {
            uri: environment.routes.loadouts,
            httpMethod: 'POST',
            tokenOptions: {
              authorizationParams: {
                audience: AUDIENCE
              }
            }
          },
          {
            uri: `${environment.routes.loadouts}/*`,
            httpMethod: 'PUT',
            tokenOptions: {
              authorizationParams: {
                audience: AUDIENCE
              }
            }
          },
          {
            uri: `${environment.routes.loadouts}/*`,
            httpMethod: 'DELETE',
            tokenOptions: {
              authorizationParams: {
                audience: AUDIENCE
              }
            }
          }
        ]
      }
    })
  ]
};
