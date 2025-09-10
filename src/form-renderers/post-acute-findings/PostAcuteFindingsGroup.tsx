import React from "react";
import { Layout, LayoutProps, RankedTester, rankWith } from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";
import { isPostAcuteFindings } from "./isPostAcuteFindings";
import { Divider, InputLabel, Paper } from "@mui/material";
import { CheckboxControl, checkboxControlTester } from "./CheckboxControl";
import { PostAcuteFindingsContext } from "./PostAcuteFindingsContext";
import { rendererStyles as styles } from "doc-marker";

const bodyRenderers = [
  { tester: checkboxControlTester, renderer: CheckboxControl },
];
const bodyCells = [];

export function ResqPostAcuteFindingsGroupUnwrapped(props: LayoutProps) {
  const { label, enabled, schema, uischema, visible } = props;

  const elements = (uischema as Layout).elements;

  ///////////////
  // Rendering //
  ///////////////

  return (
    <PostAcuteFindingsContext.Provider
      value={{
        groupVisible: visible,
      }}
    >
      <Paper
        sx={{
          display: visible ? "block" : "none",
          ml: 2,
          mt: 2, // the controls themselves have margin, grid does not
        }}
      >
        <InputLabel className={styles["field-label"]}>
          {label || "[missing group label]"}
        </InputLabel>
        <Divider />

        {elements.map((child, index) => (
          <JsonFormsDispatch
            key={"" + index}
            uischema={child}
            schema={schema}
            enabled={enabled}
            renderers={bodyRenderers}
            cells={bodyCells}
          />
        ))}
      </Paper>
    </PostAcuteFindingsContext.Provider>
  );
}

export const resqPostAcuteFindingsGroupTester: RankedTester = rankWith(
  10,
  isPostAcuteFindings,
);

export const ResqPostAcuteFindingsGroup = withJsonFormsLayoutProps(
  React.memo(ResqPostAcuteFindingsGroupUnwrapped),
);
