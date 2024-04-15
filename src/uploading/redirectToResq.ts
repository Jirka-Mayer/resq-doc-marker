import config from "../config";
import { getCallbackUrl } from "./getCallbackUrl";

/**
 * Calling this function redirects the user agent to the RES-Q auth server
 * and starts the login sequence with the provided file UUID
 */
export function redirectToResq(uuid: string) {
  // Based on the OAuth 2 specification:
  // https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1

  const url = new URL(config.keycloakAuthUrl);
  
  // what OAuth client is making the authentication request
  url.searchParams.append("client_id", config.oauthClientId);

  // what privileges are we asking for
  url.searchParams.append("scope", "openid email profile");
  
  // request OAuth authorization code method
  url.searchParams.append("response_type", "code");

  // where to redirect after the authentication completes
  url.searchParams.append("redirect_uri", getCallbackUrl());

  // what state information to send with the redirect callback
  url.searchParams.append("state", uuid);
  
  // do the redirect
  window.location.href = url.href;
}
