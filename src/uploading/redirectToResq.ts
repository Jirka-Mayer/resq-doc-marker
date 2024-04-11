import config from "../config";

/**
 * Calling this function redirects the user agent to the RES-Q auth server
 * and starts the login sequence with the provided file UUID
 */
export function redirectToResq(uuid: string) {
  const url = new URL(config.keycloakAuthUrl);
  
  // what OAuth client is making the authentication request
  url.searchParams.append("client_id", config.oauthClientId);

  // what privileges are we asking for
  url.searchParams.append("scope", "openid email profile");
  
  // request OAuth authorization code method
  url.searchParams.append("response_type", "code");

  // where to redirect after the authentication completes
  const redirect_uri = new URL(
    window.location.href.replace(window.location.search, "")
  );
  redirect_uri.searchParams.append("keycloakCallback", "true");
  url.searchParams.append("redirect_uri", redirect_uri.href);

  // what state information to send with the redirect callback
  url.searchParams.append("state", uuid);
  
  // do the redirect
  window.location.href = url.href;
}
