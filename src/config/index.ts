import { Config } from "./Config";
import development from "./development";
import production from "./production";

// the config is development, unless production origin is detected
let config: Config = development;

const PRODUCTION_ORIGINS = [
  "https://quest.ms.mff.cuni.cz"
];

for (const origin of PRODUCTION_ORIGINS) {
  if (window.location.origin === origin) {
    config = production;
    break;
  }
}

export default config;
