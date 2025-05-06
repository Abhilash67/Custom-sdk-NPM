import createAuth0Client from '@auth0/auth0-spa-js';

let auth0 = null;
let user = null;
let token = null;
let isAuthenticated = false;


// Recommended config Structure
//const config = {
//  domain: 'your-auth0-domain.auth0.com',        // Required
  // client_id: 'your-client-id',                  // Required
  // redirect_uri: window.location.origin,         // Optional (default is current URL)
//   audience: 'https://your-api-identifier',      // Optional, for API access
//   cacheLocation: 'localstorage',                // Optional: 'memory' | 'localstorage'
//   useRefreshTokens: true,                       // Optional: enables silent refresh
//   scope: 'openid profile email',                // Optional: default scopes
// };
export async function initAuth(config) {
  auth0 = await createAuth0Client(config);

  isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    user = await auth0.getUser();
    token = await auth0.getTokenSilently();
  } else if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    await auth0.handleRedirectCallback();
    user = await auth0.getUser();
    token = await auth0.getTokenSilently();
    isAuthenticated = true;
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

export async function login(redirectUri) {
  await auth0.loginWithRedirect({ redirect_uri: redirectUri });
}

export function logout(returnTo) {
  auth0.logout({ returnTo });
}

export function getUser() {
  return user;
}

export function getToken() {
  return token;
}

export function isLoggedIn() {
  return isAuthenticated;
}


// how to use in react app 
// import { initAuth, login, logout, getUser } from '@your-org/auth0-wrapper';

// useEffect(() => {
//   initAuth({
//     domain: 'your-tenant.auth0.com',
//     client_id: 'your-client-id',
//     redirect_uri: window.location.origin
//   });
// }, []);

//How to use in Angular app

// import { initAuth, login, logout, getUser } from '@your-org/auth0-wrapper';

// ngOnInit() {
//   initAuth({
//     domain: 'your-tenant.auth0.com',
//     client_id: 'your-client-id',
//     redirect_uri: window.location.origin
//   });
// }
