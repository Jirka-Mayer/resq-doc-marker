// perform interception before anything starts happening
import "./uploading/pageLoadingIntercept";

import { bootstrapDocMarker, defaultOptions } from "doc-marker"
import packageJson from "../package.json"
import localeDefinitions from "../locales/index.js"
import formDefinitions from "../forms/index.js"
import * as slots from "./slots.jsx"
import * as resqMetadataStore from "./state/resqMetadataStore"

bootstrapDocMarker({
  element: document.getElementById("doc-marker"),
  customization: {
    name: "DocMarker for RES-Q+",
    version: packageJson.version,
    appBarLogoUrl: new URL("./resq-logo.png", import.meta.url)
  },
  locales: {
    ...localeDefinitions
  },
  forms: {
    ...formDefinitions
  },
  defaultFormId: "Official ResQ 3.1.1",
  formRenderersImporter: async () => {
    const dmRenderers = await defaultOptions.formRenderersImporter()
    const resqRenderers = (await import("./formRenderersAndCells.js")).formRenderers
    return [...dmRenderers, ...resqRenderers]
  },
  formCellsImporter: async () => {
    const dmCells = await defaultOptions.formCellsImporter()
    const resqCells = (await import("./formRenderersAndCells.js")).formCells
    return [...dmCells, ...resqCells]
  },
  localStoragePrefix: "ResQPlus::",

  file: {
    currentVersion: 1,
    migrations: [],
    onCreateEmpty: (fileJson) => {
      resqMetadataStore.createEmptyFileJson(fileJson);
      return fileJson;
    },
    onSerialize: (fileJson) => {
      resqMetadataStore.serializeToFileJson(fileJson);
      return fileJson;
    },
    onDeserialize: (fileJson) => {
      resqMetadataStore.deserializeFromFileJson(fileJson);
    }
  },
  
  // slots are now loaded synchronously, but should that be a problem,
  // you can switch to asynchronous loading after the doc marker bootstraps
  // (in which case don't forget to remove the slots import at the top)
  slots: { ...slots }
  // slotsImporter: async () => {
  //   return await import("./slots.jsx")
  // }
})
