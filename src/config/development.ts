import { Config } from "./Config";

const config: Config = {
  resqApiBaseUrl: "https://stroke.dev.qualityregistry.org/api/rest/hpfdc/",
  keycloakAuthUrl: "https://auth.dev.qualityregistry.org/realms/stroke/protocol/openid-connect/auth",
  oauthClientId: "doc-marker",
  uploadServerBaseUrl: "https://quest.ms.mff.cuni.cz/resq-doc-marker/backend/",
  uploadServerActInDevelopment: true,
  resqRecordUrl: (id) => `https://stroke.dev.qualityregistry.org/data-collection/record/${id}/form`,
};

export default config;
