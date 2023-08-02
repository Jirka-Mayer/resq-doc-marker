import { bootstrapDocMarker } from "doc-marker"
import packageJson from "../package.json"
import localeDefinitions from "../locales/index.js"

bootstrapDocMarker({
  element: document.getElementById("doc-marker"),
  customization: {
    name: "DocMarker for RES-Q+",
    version: packageJson.version,
    appBarLogoUrl: new URL("./resq-logo.png", import.meta.url)
  },
  locales: {
    ...localeDefinitions
  }
})
