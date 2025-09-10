import React, { useContext } from "react";
import {
  rankWith,
  toDataPath,
  toDataPathSegments,
  RankedTester,
  LayoutProps,
  Layout,
  UISchemaElement,
} from "@jsonforms/core";
import {
  JsonFormsDispatch,
  TranslateProps,
  withJsonFormsLayoutProps,
  withTranslateProps,
} from "@jsonforms/react";
import { isMultiselectGroup } from "./isMultiselectGroup";
import { Divider, FormHelperText, Paper } from "@mui/material";
import { LeaderControl, leaderControlTester } from "./LeaderControl";
import {
  BodyVerticalLayout,
  bodyVerticalLayoutTester,
} from "./BodyVerticalLayout";
import { BodyGroupLayout, bodyGroupLayoutTester } from "./BodyGroupLayout";
import {
  BodyCheckboxControl,
  bodyCheckboxControlTester,
} from "./BodyCheckboxControl";
import { MultiselectGroupContext } from "./MultiselectGroupContext";
import _ from "lodash";
import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  DocMarkerContext,
  rendererStyles as styles,
  userPreferencesStore,
  dmLinearLayoutTester,
  DmLinearLayout,
} from "doc-marker";

function leaderScopeToGroupPath(scope: string): string {
  const segments = toDataPathSegments(scope);
  segments.pop();
  return segments.join(".");
}

function leaderScopeToLeaderKey(scope: string): string {
  const segments = toDataPathSegments(scope);
  return segments.pop() || "";
}

function allCheckboxesAreFalse(
  data: any,
  groupPath: string,
  leaderKey: string | null,
): boolean {
  const groupData = _.get(data, groupPath);

  for (const key in groupData) {
    if (key === leaderKey) continue;

    if (typeof groupData[key] === "object") {
      if (!allCheckboxesAreFalse(data, groupPath + "." + key, null))
        return false;
    } else {
      if (groupData[key] === true) return false;
    }
  }

  return true;
}

const leaderRenderers = [
  { tester: leaderControlTester, renderer: LeaderControl },
];
const leaderCells = [];
const bodyRenderers = [
  // special vertical layout, because the checkboxes are closer together
  // than in normal layout
  { tester: bodyVerticalLayoutTester, renderer: BodyVerticalLayout },
  // for horizontal layout, use the DocMarker linear layout
  // Do not use material layout, because it does some smart non-rendering
  // of invisible items, which breaks the form data exporting system.
  { tester: dmLinearLayoutTester, renderer: DmLinearLayout },

  { tester: bodyGroupLayoutTester, renderer: BodyGroupLayout },
  { tester: bodyCheckboxControlTester, renderer: BodyCheckboxControl },
];
const bodyCells = [];

export function ResqMultiselectGroupUnwrapped(
  props: LayoutProps & TranslateProps,
) {
  const { schema, uischema, visible, data, t } = props;

  const layout = props.uischema as Layout;

  const { fieldsRepository } = useContext(DocMarkerContext);

  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom);

  const leaderUischema = layout.elements[0] as UISchemaElement & {
    scope: string;
  };
  const leaderPath = toDataPath(leaderUischema.scope); // foo.bar.medication_any
  const leaderKey = leaderScopeToLeaderKey(leaderUischema.scope); // medication_any
  const groupPath = leaderScopeToGroupPath(leaderUischema.scope); // foo.bar
  const leaderValue = fieldsRepository.useExportedValueOf(leaderPath);

  const bodyUischema = layout.elements[1];

  const leaderOptions = leaderUischema.options || {};
  const allowNone = leaderOptions.multiselectAllowNone === true;

  ///////////////
  // Rendering //
  ///////////////

  let errors = "";

  const atLeastOneError = useMemo(
    () =>
      t(leaderPath + ".error.multiselect", "Select at least one of following", {
        schema,
        leaderUischema,
        leaderPath,
      }),
    [t, schema, leaderUischema, leaderPath],
  );

  if (
    !allowNone && // this allows for empty multiselect (no checkboxes checked)
    leaderValue === true &&
    allCheckboxesAreFalse(data, groupPath, leaderKey)
  ) {
    errors = atLeastOneError;
  }

  return (
    <MultiselectGroupContext.Provider
      value={{
        leaderValue: leaderValue,
        leaderPath: leaderPath,
        inSubGroup: false,
        isGroupVisible: visible,
      }}
    >
      <Paper
        sx={{
          // visibility normally toggles "display: none",
          // but if the debug mode is enabled, invisible controls are
          // rendered, only at a 50% opacity.
          display: visible || displayDebugInfo ? "block" : "none",
          opacity: !visible && displayDebugInfo ? 0.5 : undefined,

          // the controls themselves have margin, grid does not
          ml: 2,
          mt: 2,
        }}
      >
        <JsonFormsDispatch
          uischema={leaderUischema}
          schema={schema}
          enabled={true} // we do not support being disabled
          renderers={leaderRenderers}
          cells={leaderCells}
        />

        {leaderValue === true && <Divider />}

        <JsonFormsDispatch
          uischema={bodyUischema}
          schema={schema}
          enabled={true} // checkboxes handle that on their own
          renderers={bodyRenderers}
          cells={bodyCells}
        />

        {/* <pre>{ JSON.stringify(_.get(data, groupPath), null, 2) }</pre> */}

        {errors !== "" && (
          <FormHelperText
            className={styles["field-error-message"]}
            error={true}
          >
            {errors}
          </FormHelperText>
        )}
      </Paper>
    </MultiselectGroupContext.Provider>
  );
}

export const resqMultiselectGroupTester: RankedTester = rankWith(
  10,
  isMultiselectGroup,
);

export const ResqMultiselectGroup = withJsonFormsLayoutProps(
  withTranslateProps(React.memo(ResqMultiselectGroupUnwrapped)),
);
