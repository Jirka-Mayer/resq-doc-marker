import React, { useContext } from "react";
import {
  Layout,
  LayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";
import { MultiselectGroupContext } from "./MultiselectGroupContext";

export function BodyVerticalLayoutUnwrapped(props: LayoutProps) {
  const { uischema, schema, path, renderers, cells } = props;

  const { leaderValue } = useContext(MultiselectGroupContext);

  // === visible ===

  let visible = false;

  if (leaderValue === undefined) {
    visible = true;
  }

  if (leaderValue === true) {
    visible = true;
  }

  // === rendering ===

  const elements = (uischema as Layout).elements;

  if (elements.length === 0) return null;

  return elements.map((child, index) => (
    <div
      key={`${path}-${index}`}
      style={{ display: visible ? "block" : "none" }}
    >
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        path={path}
        enabled={true} // checkboxes handle that on their own
        renderers={renderers}
        cells={cells}
      />
    </div>
  ));
}

export const bodyVerticalLayoutTester: RankedTester = rankWith(
  2,
  uiTypeIs("VerticalLayout"),
);

export const BodyVerticalLayout = withJsonFormsLayoutProps(
  React.memo(BodyVerticalLayoutUnwrapped),
);
