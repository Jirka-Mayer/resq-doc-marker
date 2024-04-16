import { Config } from "./Config";
import development from "./development";
import localDevelopment from "./localDevelopment";
import production from "./production";

// the config is development, unless production
// or local development origin is detected
let config: Config = development;

// Production
if (window.location.origin === "https://quest.ms.mff.cuni.cz") {
  config = production;
}
// Local Development
else if (window.location.hostname === "localhost") {
  config = localDevelopment;
}

export default config;
