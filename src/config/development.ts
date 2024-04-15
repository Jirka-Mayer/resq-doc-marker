import { Config } from "./Config";

const config: Config = {
  resqApiBaseUrl: "https://stroke.dev.qualityregistry.org/api/rest/apac/",
  keycloakAuthUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/auth",
  keycloakTokenUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/token",
  oauthClientId: "frontend",
};

export default config;
