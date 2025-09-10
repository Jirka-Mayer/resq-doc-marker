import React, { useContext } from "react";
import {
  rankWith,
  toDataPath,
  uiTypeIs,
  LayoutProps,
  Layout,
} from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";
import * as multiselectStyles from "./multiselect.module.scss";
import _ from "lodash";
import { MultiselectGroupContext } from "./MultiselectGroupContext";
import { DocMarkerContext } from "doc-marker";

function BodyGroupLayoutUnwrapped(props: LayoutProps) {
  const { uischema, schema, path, renderers, cells, data } = props;

  const { fieldsRepository } = useContext(DocMarkerContext);

  const { isGroupVisible } = React.useContext(MultiselectGroupContext);

  const elements = (uischema as Layout).elements;

  if (elements.length === 0) return null;

  const leaderScope = (uischema?.rule?.condition as any)?.scope;
  const leaderPath = toDataPath(leaderScope);
  const leaderValue = fieldsRepository.useExportedValueOf(leaderPath);

  // === visible ===

  let visible = false;

  if (leaderValue === true) {
    visible = true;
  }

  // === rendering ===

  return (
    <MultiselectGroupContext.Provider
      value={{
        leaderValue: leaderValue,
        leaderPath: leaderPath,
        inSubGroup: true,
        isGroupVisible: isGroupVisible,
      }}
    >
      {elements.map((child, index) => (
        <div
          key={`${path}-${index}`}
          style={{ display: visible ? "block" : "none" }}
          className={multiselectStyles["group-item"]}
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
      ))}
    </MultiselectGroupContext.Provider>
  );
}

export const bodyGroupLayoutTester = rankWith(1, uiTypeIs("Group"));

export const BodyGroupLayout = withJsonFormsLayoutProps(
  React.memo(BodyGroupLayoutUnwrapped),
);
