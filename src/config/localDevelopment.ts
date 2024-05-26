import { Config } from "./Config";
import development from "./development";

const config: Config = {
  ...development,
  uploadServerBaseUrl: "http://localhost:8000/",
  uploadServerActInDevelopment: true,
};

export default config;
