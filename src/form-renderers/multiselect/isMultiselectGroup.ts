import {
  uiTypeIs,
  schemaTypeIs,
  isControl,
  UISchemaElement,
  JsonSchema,
  TesterContext,
  LayoutProps,
  Layout,
} from "@jsonforms/core";

// See for inspiration:
// https://github.com/eclipsesource/jsonforms/blob/master/packages/core/src/testers/testers.ts

/**
 * UI Schema tester for JSON forms, matches the multiselect group
 */
export function isMultiselectGroup(
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext,
): boolean {
  if (!uiTypeIs("Group")(uischema, schema, context)) return false;

  const layout = uischema as Layout;

  if (!Array.isArray(layout.elements)) return false;

  if (layout.elements.length !== 2) return false;

  // multiselect leader control
  const leader = layout.elements[0];

  if (!isControl(leader)) return false;

  if (!schemaTypeIs("boolean")(leader, schema, context)) return false;

  if (!leader.options || typeof leader.options !== "object") return false;

  return leader.options.multiselect === true;
}
