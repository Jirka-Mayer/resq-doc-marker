import { Config } from "./Config";

const config: Config = {
  resqApiBaseUrl: "https://stroke.qualityregistry.org/api/rest/apac/",
  keycloakAuthUrl: "https://auth.qualityregistry.org/realms/stroke/protocol/openid-connect/auth",
  keycloakTokenUrl: "https://auth.qualityregistry.org/realms/stroke/protocol/openid-connect/token",
  oauthClientId: "doc-marker", // TODO: register this client with the keycloak
};

export default config;
