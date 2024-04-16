import { Config } from "./Config";
import development from "./development";

const config: Config = {
  ...development,
  ufalUploadUrl: "http://localhost:8000/uploaded-file",
  ufalUploadIsDevelopment: true,
};

export default config;
