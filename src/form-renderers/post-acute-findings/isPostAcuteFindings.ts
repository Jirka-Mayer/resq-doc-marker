import {
  uiTypeIs,
  UISchemaElement,
  JsonSchema,
  TesterContext,
} from "@jsonforms/core";

/**
 * UI Schema tester for JSON forms,
 * "group.post_acute.findings" group
 * @param {any} uischema
 */
export function isPostAcuteFindings(
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext,
): boolean {
  if (!uiTypeIs("Group")(uischema, schema, context)) return false;

  return uischema["label"] === "group.post_acute.findings";
}
