// This file exports form importers for all form IDs

import { FormDefinition } from "doc-marker/forms/FormDefinition";

export interface ResqFormDefinition extends FormDefinition {
  /**
   * IDs of form localizations in the RES-Q backend.
   * Necessary for uploading to RES-Q.
   */
  resqFormLocalizationIds?: {
    development: {
      [localeId: string]: number;
    };
    production: {
      [localeId: string]: number;
    };
  };
}

export interface ResqFormDefinitions {
  [formId: string]: ResqFormDefinition;
}

export const resqFormDefinitions: ResqFormDefinitions = {
  /**
   * RES-Q 3.5.0 standard form
   */
  "RES-Q 3.5.0 standard form": {
    dataSchemaImporter: async () =>
      (await import("./RES-Q 3.5.0 standard form/schema")).default,
    uiSchemaImporter: async () =>
      (await import("./RES-Q 3.5.0 standard form/uischema")).default,
    translationImporters: {
      cs: async () =>
        await import("./RES-Q 3.5.0 standard form/dictionary_cz.json"),
      "en-GB": async () =>
        await import("./RES-Q 3.5.0 standard form/dictionary_en.json"),
      // en-US falls back on en-GB
    },
    resqFormLocalizationIds: {
      development: {
        "en-GB": 58,
        cs: 59,
      },
      production: {
        "en-GB": 201, // acts as fallback for all others that are missing
        cs: 202,
      },
    },
  },

  /**
   * RES-Q 3.1.7 standard form
   */
  "RES-Q 3.1.7 standard form": {
    dataSchemaImporter: async () =>
      await import("./RES-Q 3.1.7 standard form/schema.json"),
    uiSchemaImporter: async () =>
      (await import("./RES-Q 3.1.7 standard form/uischema")).default,
    translationImporters: {
      cs: async () =>
        await import("./RES-Q 3.1.7 standard form/dictionary_cz.json"),
      "en-GB": async () =>
        await import("./RES-Q 3.1.7 standard form/dictionary_en.json"),
      // en-US falls back on en-GB
    },
    resqFormLocalizationIds: {
      development: {
        "en-GB": 20,
        cs: 21,
      },
      production: {
        "en-GB": 62, // acts as fallback for all others that are missing
        cs: 64,
      },
    },
  },

  /**
   * Official ResQ 3.1.1
   */
  "Official ResQ 3.1.1": {
    dataSchemaImporter: async () =>
      await import("./Official ResQ 3.1.1/schema.json"),
    uiSchemaImporter: async () =>
      await import("./Official ResQ 3.1.1/uischema.json"),
    translationImporters: {
      cs: async () => await import("./Official ResQ 3.1.1/dictionary_cz.json"),
      "en-GB": async () =>
        await import("./Official ResQ 3.1.1/dictionary_en.json"),
      // en-US falls back on en-GB
    },
  },
};
