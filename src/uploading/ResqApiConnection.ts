import config from "../config";

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

  static async connect(authorizationCode: string) {
    // TODO ...
    return new ResqApiConnection("... TODO ...");
  }
}
