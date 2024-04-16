export interface Config {
  /**
   * Base URL for the RES-Q registry API
   */
  resqApiBaseUrl: string,


  ////////////////////
  // Authentication //
  ////////////////////

  /**
   * The "login" page of the keycloak server where we redict the user to
   */
  keycloakAuthUrl: string,

  /**
   * The endpoint for exchanging an authorization code for the access token
   * (the OAuth2 *token endpoint*)
   */
  keycloakTokenUrl: string,

  /**
   * Name of the doc-marker OAuth2 client,
   * set to the RES-Q "login" page as a parameter,
   * needs to be white-listed in the keycloak configuration
   */
  oauthClientId: string,

  /**
   * URL where a finished file should be uploaded to,
   * in order to upload it to the Charles University
   */
  ufalUploadUrl: string,

  /**
   * Should the Charles University upload be a development,
   * or a production upload?
   */
  ufalUploadIsDevelopment: boolean,
}
