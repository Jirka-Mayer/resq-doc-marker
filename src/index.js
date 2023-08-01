import { bootstrapDocMarker } from "doc-marker"
import packageJson from "../package.json"

bootstrapDocMarker({
  element: document.getElementById("doc-marker"),
  customization: {
    name: "DocMarker for RES-Q+",
    version: packageJson.version
  }
})
