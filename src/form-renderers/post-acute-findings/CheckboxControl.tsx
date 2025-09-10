import React from "react";
import {
  rankWith,
  isBooleanControl,
  RankedTester,
  ControlProps,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useCallback } from "react";
import * as multiselectStyles from "../multiselect/multiselect.module.scss";
import { useContext } from "react";
import { PostAcuteFindingsContext } from "./PostAcuteFindingsContext";

// DocMarker API imports
import {
  rendererStyles as styles,
  useHighlightPinButton,
  useFieldActivity,
  DocMarkerContext,
} from "doc-marker";

export function CheckboxControlUnwrapped(props: ControlProps & TranslateProps) {
  const { path, label, data, id, handleChange, visible, uischema } = props;

  const { groupVisible } = useContext(PostAcuteFindingsContext);

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
        checked={data === true}
        onChange={(e) => handleChange(path, e.target.checked)}
        color={hasVerifiedAppearance ? "success" : "primary"}
        onFocus={onFocus}
      />
      <FormControlLabel
        control={<span></span>} // not the checkbox to disable "click label to check"
        label={label || fieldId}
        style={{ marginLeft: 0 }}
      />

      <HighlightPinButton />

      {/* TODO: robot validation button */}
    </div>
  );
}

export const checkboxControlTester: RankedTester = rankWith(
  2,
  isBooleanControl,
);

export const CheckboxControl = withJsonFormsControlProps(
  withTranslateProps(React.memo(CheckboxControlUnwrapped)),
);
