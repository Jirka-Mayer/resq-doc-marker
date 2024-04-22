import { Config } from "./Config";

const config: Config = {
  resqApiBaseUrl: "https://stroke.dev.qualityregistry.org/api/rest/apac/",
  keycloakAuthUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/auth",
  keycloakTokenUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/token",
  oauthClientId: "doc-marker",
  ufalUploadUrl: "https://quest.ms.mff.cuni.cz/resq-doc-marker/backend/uploaded-file",
  ufalUploadIsDevelopment: true,
};

export default config;
