import React from "react";
import {
  rankWith,
  isBooleanControl,
  ControlProps,
  RankedTester,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useContext, useCallback } from "react";
import { MultiselectGroupContext } from "./MultiselectGroupContext";
import * as multiselectStyles from "./multiselect.module.scss";

// DocMarker API imports
import {
  rendererStyles as styles,
  useHighlightPinButton,
  useFieldActivity,
  DocMarkerContext,
} from "doc-marker";

export function BodyCheckboxControlUnwrapped(
  props: ControlProps & TranslateProps,
) {
  const { path, uischema, label, data, visible, id, handleChange } = props;

  const { leaderValue, leaderPath, inSubGroup } = useContext(
    MultiselectGroupContext,
  );

  const fieldId = path; // field ID is defined to be the path in the form data
  const htmlId = id + "-input";

  // get access to the global context
  const { fieldsRepository, robotPredictionStore } =
    useContext(DocMarkerContext);

  // === field activity ===

  const { isFieldActive, toggleFieldActivity, setFieldActive } =
    useFieldActivity(fieldId);

  // === field highlights ===

  const { HighlightPinButton } = useHighlightPinButton({
    ...props,
    fieldId,
  });

  // === fields repository connection ===

  // coercion function converts any data to valid data for the field
  // as well as it can
  const coerceData = useCallback((givenValue) => {
    // preserve undefined
    if (givenValue === undefined) {
      return undefined;
    }

    // run the inner component coersion
    return Boolean(givenValue);
  }, []);

  fieldsRepository.useFieldsRepositoryConnection({
    fieldId,
    data,
    visible,
    handleChange,
    coerceData,
  });

  // === robot prediction data ===

  const fieldPrediction = robotPredictionStore.useFieldPrediction(
    fieldId,
    data,
  );

  // TODO ...
  const hasVerifiedAppearance = false;

  /////////////
  // Actions //
  /////////////

  function onFocus() {
    setFieldActive();
  }

  ///////////////
  // Rendering //
  ///////////////

  const enabled = leaderValue !== undefined;

  const checked = enabled
    ? data === true // enabled --> display the "data" value
    : false; // disabled --> display as empty

  return (
    <div
      className={[
        styles["field-row"],
        isFieldActive ? styles["field-row--active"] : "",
        hasVerifiedAppearance ? styles["field-row--verified"] : "",
        multiselectStyles["checkbox-row"],
      ].join(" ")}
      onClick={() => setFieldActive()}
    >
      <Checkbox
        id={htmlId}
        checked={checked}
        onChange={(e) => handleChange(path, e.target.checked)}
        disabled={!enabled}
        color={hasVerifiedAppearance ? "success" : "primary"}
        onFocus={onFocus}
      />
      <FormControlLabel
        control={<span></span>} // not the checkbox to disable "click label to check"
        label={label || fieldId}
        disabled={!enabled}
        style={{ marginLeft: 0 }}
      />

      <HighlightPinButton />

      {/* TODO: robot validation button */}
    </div>
  );
}

export const bodyCheckboxControlTester: RankedTester = rankWith(
  2,
  isBooleanControl,
);

export const BodyCheckboxControl = withJsonFormsControlProps(
  withTranslateProps(React.memo(BodyCheckboxControlUnwrapped)),
);
