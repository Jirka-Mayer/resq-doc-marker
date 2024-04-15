import config from "../config";
import { ResqUser } from "../resq-model/ResqUser";
import { getCallbackUrl } from "./getCallbackUrl";

/**
 * Encapsulates an authenticated connection to the RES-Q registry API
 */
export class ResqApiConnection {
  /**
   * The OAuth 2.0 access token needed to use the API
   */
  private accessToken: string;
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Exchanges and authorization code for an acces token,
   * thereby establishing a connection to the RES-Q registry API
   */
  static async connect(authorizationCode: string): Promise<ResqApiConnection> {
    // the list of Keycloak endpoints is documented here:
    // https://www.keycloak.org/docs/24.0.2/securing_apps/#endpoints
    // and we care about the "token endpoint",
    // which is the one that exchanges an authorization code for an access token

    // The request format is described by the OAuth 2 specs:
    // https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3

    const response = await fetch(config.keycloakTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        "grant_type": "authorization_code",
        "code": authorizationCode,
        "redirect_uri": getCallbackUrl(),
        "client_id": config.oauthClientId
      })
    });

    const data = await response.json();

    if ("error" in data) {
      throw new Error(data.error + ": " + data.error_description);
    }
    
    console.log("Authenticated:", data);
    
    // TODO ...
    return new ResqApiConnection("... TODO ...");
  }

  /**
   * Fetches information about the authenticated RES-Q user
   * (the /myself endpoint)
   */
  public async getAuthenticatedUser(): Promise<ResqUser> {
    const response = await fetch(
      new URL("myself", config.resqApiBaseUrl),
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + this.accessToken
        },
      }
    );

    if (response.status !== 200) {
      let msg = `Non-200 status (${response.status} ${response.statusText})\n`;
      msg += "Response body: " + await response.text();
      throw new Error(msg);
    }

    const data = await response.json();

    return data as ResqUser;
  }
}
