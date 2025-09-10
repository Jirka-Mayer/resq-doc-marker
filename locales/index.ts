import { getDefaultOptions } from "doc-marker";
import { LocaleDefinition } from "doc-marker/locales/LocaleDefinition";
import _ from "lodash";

async function extendImporter(
  localeId: string,
  extensionImporter: () => Promise<any>,
): Promise<any> {
  const defaultOptions = getDefaultOptions();
  const namespaces = await defaultOptions.locales[localeId].importer();
  const extension = await extensionImporter();
  return _.merge({}, namespaces, extension);
}

export const resqLocaleDefinitions: {
  [localeId: string]: Partial<LocaleDefinition>;
} = {
  cs: {
    importer: () => extendImporter("cs", () => import("./cs")),
  },
  "en-GB": {
    importer: () => extendImporter("en-GB", () => import("./en-GB")),
  },
};
