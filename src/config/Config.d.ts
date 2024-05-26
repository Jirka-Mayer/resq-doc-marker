export type UrlMapper = (id: any) => string;

export interface Config {
  /**
   * Base URL for the RES-Q registry API
   */
  resqApiBaseUrl: string,

  /**
   * The "login" page of the keycloak server where we redict the user to
   */
  keycloakAuthUrl: string,

  /**
   * Name of the doc-marker OAuth2 client,
   * sent to the RES-Q "login" page as a parameter,
   * needs to be white-listed in the keycloak configuration
   */
  oauthClientId: string,

  /**
   * Base URL of the upload server that runs at ÚFAL
   */
  uploadServerBaseUrl: string,

  /**
   * Should we present ourselves to the upload server as a development
   * client or as a production client?
   */
  uploadServerActInDevelopment: boolean,

  /**
   * Lambda that maps record ID to its URL
   */
  resqRecordUrl: UrlMapper,
}
