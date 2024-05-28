// This file exports form importers for all form IDs

export default {

  /**
   * RES-Q 3.1.7 standard form
   */
  "RES-Q 3.1.7 standard form": {
    dataSchemaImporter: async () => await import("./RES-Q 3.1.7 standard form/schema.json"),
    uiSchemaImporter: async () => (await import("./RES-Q 3.1.7 standard form/uischema.js")).default,
    translationImporters: {
      "cs": async () => await import("./RES-Q 3.1.7 standard form/dictionary_cz.json"),
      "en-GB": async () => await import("./RES-Q 3.1.7 standard form/dictionary_en.json"),
      // en-US falls back on en-GB
    },
    resqFormLocalizationIds: {
      development: {
        "en-GB": 20,
        "cs": 21
      },
      production: {
        "en-GB": 62, // acts as fallback for all others that are missing
        "cs": 64
      }
    }
  },

  /**
   * Official ResQ 3.1.1
   */
  "Official ResQ 3.1.1": {
    dataSchemaImporter: async () => await import("./Official ResQ 3.1.1/schema.json"),
    uiSchemaImporter: async () => await import("./Official ResQ 3.1.1/uischema.json"),
    translationImporters: {
      "cs": async () => await import("./Official ResQ 3.1.1/dictionary_cz.json"),
      "en-GB": async () => await import("./Official ResQ 3.1.1/dictionary_en.json"),
      // en-US falls back on en-GB
    }
  },

}