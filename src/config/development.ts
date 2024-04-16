import { Config } from "./Config";

const config: Config = {
  resqApiBaseUrl: "https://stroke.dev.qualityregistry.org/api/rest/apac/",
  keycloakAuthUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/auth",
  keycloakTokenUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/token",
  oauthClientId: "frontend",
  ufalUploadUrl: "https://quest.ms.mff.cuni.cz/resq-plus/api/uploaded-file",
  ufalUploadIsDevelopment: true,
};

export default config;
