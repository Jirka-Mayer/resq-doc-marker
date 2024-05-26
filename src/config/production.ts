import { Config } from "./Config";

const config: Config = {
  resqApiBaseUrl: "https://stroke.qualityregistry.org/api/rest/hpfdc/",
  keycloakAuthUrl: "https://auth.qualityregistry.org/realms/stroke/protocol/openid-connect/auth",
  oauthClientId: "doc-marker",
  uploadServerBaseUrl: "https://quest.ms.mff.cuni.cz/resq-doc-marker/backend/",
  uploadServerActInDevelopment: false,
  resqRecordUrl: (id) => `https://stroke.qualityregistry.org/data-collection/record/${id}/form`,
};

export default config;
