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
import {
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import { useContext, useCallback } from "react";
import { MultiselectGroupContext } from "./MultiselectGroupContext";
import * as multiselectStyles from "./multiselect.module.scss";

// DocMarker API imports
import {
  rendererStyles as styles,
  useHighlightPinButton,
  useFieldActivity,
  DocMarkerContext,
  RobotButtons,
} from "doc-marker";

export function BodyCheckboxControlUnwrapped(
  props: ControlProps & TranslateProps,
) {
  const { path, uischema, label, data, visible, id, handleChange, t } = props;

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
        multiselectStyles["checkbox-row"],
      ].join(" ")}
      style={{
        position: "relative", // captures the backdrop
      }}
      onClick={() => {
        if (!fieldPrediction.isBeingPredicted) {
          setFieldActive();
        }
      }}
    >
      <Checkbox
        id={htmlId}
        checked={checked}
        onChange={(e) => handleChange(path, e.target.checked)}
        disabled={!enabled}
        color="primary"
        onFocus={onFocus}
      />
      <FormControlLabel
        control={<span></span>} // not the checkbox to disable "click label to check"
        label={label || fieldId}
        disabled={!enabled}
        style={{ marginLeft: 0 }}
      />

      <HighlightPinButton />

      {/* Human validation in Multiselect groups is a little different
      semantics-wise. It is only done for fields predicted as "true",
      and ignored for others and ignored for the leader control when "true". */}
      {enabled && data === true && (
        <RobotButtons
          t={t}
          fieldId={fieldId}
          fieldPrediction={fieldPrediction}
        />
      )}

      {fieldPrediction.isBeingPredicted && (
        <Backdrop
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.8)",
          }}
          open={true}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
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
