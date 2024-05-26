import { currentOptions } from "doc-marker";
import config from "../config";

/**
 * Maps the DocMarker form ID to the RES-Q form localization ID based on
 * the lookup dictionaries in form definitions and the current language
 * of the app.
 */
export function getResqFormLocalizationId(
  docMarkerFormId: string,
  language: string
): number {
  // get the definition of the current form
  const formDefinition = currentOptions.forms[docMarkerFormId];

  if (!formDefinition) {
    throw new Error("Failed to load form definition for: " + docMarkerFormId);
  }

  // select dev or prod
  const lookupDictionary = (config.uploadServerActInDevelopment
    ? formDefinition?.resqFormLocalizationIds?.development
    : formDefinition?.resqFormLocalizationIds?.production) || {};
  
  // lookup the resqFormLocalization ID if present
  if (language in lookupDictionary) {
    return lookupDictionary[language] as number;
  }

  // human readable error for myself, when I update the form and forget...
  if (!("en-GB" in lookupDictionary)) {
    throw new Error(
      "There is no 'en-GB' RES-Q form localization ID present in form " +
      "definitions. Make sure you have provided the right configuration."
    );
  }

  // else fallback to english
  return lookupDictionary["en-GB"] as number;
}