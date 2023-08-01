import { defaultOptions } from "doc-marker"
import _ from "lodash"

async function extendImporter(locale, extensionImporter) {
  const namespaces = await defaultOptions.locales[locale].importer()
  const extension = await extensionImporter()
  return _.merge({}, namespaces, extension)
}

export default {
  "cs": {
    importer: () => extendImporter("cs", () => import("./cs")),
  },
  "en-GB": {
    importer: () => extendImporter("en-GB", () => import("./en-GB")),
  },
}
