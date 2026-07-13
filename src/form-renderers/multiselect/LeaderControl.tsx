import React, { useCallback, useContext } from "react";
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
import {
  FormHelperText,
  Divider,
  IconButton,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useMemo } from "react";
import StreamIcon from "@mui/icons-material/Stream";
import { MultiselectGroupContext } from "./MultiselectGroupContext";
import {
  DocMarkerContext,
  rendererStyles as styles,
  useFieldActivity,
  useHighlightPinButton,
  RobotButtons,
} from "doc-marker";

function stringifyValue(value) {
  if (value === true) return "yes";
  if (value === false) return "no";
  if (value === null) return "null";
  if (value === undefined) return "";
  return "";
}

function parseValue(stringValue) {
  if (stringValue === "yes") return true;
  if (stringValue === "no") return false;
  if (stringValue === "null") return null;
  if (stringValue === "") return undefined;
  return undefined;
}

function schemaAllowsNullability(schema) {
  if (!Array.isArray(schema.type)) return false;
  return schema.type.indexOf("null") !== -1;
}

const booleanCoercionFunction = (givenValue) => {
  if (typeof givenValue === "boolean") {
    return givenValue;
  }
  if (typeof givenValue === "number") {
    return givenValue !== 0;
  }
  return parseValue(String(givenValue).toLowerCase());
};

export function LeaderControlUnwrapped(props: ControlProps & TranslateProps) {
  const {
    path,
    schema,
    uischema,
    label,
    id,
    data,
    visible,
    t,
    errors,
    handleChange,
  } = props;

  const { isGroupVisible } = useContext(MultiselectGroupContext);

  const fieldId = path; // field ID is defined to be the path in the form data
  const htmlId = id + "-input";

  // get access to the global context
  const { fieldsRepository, robotPredictionStore } =
    useContext(DocMarkerContext);

  const isNullable = schemaAllowsNullability(schema);

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
  const coerceData = useCallback(
    (givenValue) => {
      // preserve undefined
      if (givenValue === undefined) {
        return undefined;
      }

      // preserve null if nullable
      if (isNullable && givenValue === null) {
        return null;
      }

      // run the inner component coersion
      return booleanCoercionFunction(givenValue);
    },
    [isNullable, booleanCoercionFunction],
  );

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

  function onRadioButtonChange(e) {
    const newValue = parseValue(e.target.value);
    handleChange(path, newValue);
  }

  ///////////////
  // Rendering //
  ///////////////

  const labelYes = useMemo(
    () => t(path + ".yes", "Yes", { schema, uischema, path }),
    [t, schema, uischema, path],
  );
  const labelNo = useMemo(
    () => t(path + ".no", "No", { schema, uischema, path }),
    [t, schema, uischema, path],
  );
  const labelNull = useMemo(
    () => t(path + ".null", "Unknown", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  const forgetTooltipLabel = useMemo(
    () => t("multiselect.forget", "Forget value", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <div
      style={{
        position: "relative", // captures the backdrop
      }}
      onClick={() => {
        if (!fieldPrediction.isBeingPredicted) {
          setFieldActive();
        }
      }}
    >
      <InputLabel className={styles["field-label"]} htmlFor={htmlId}>
        {label || `${fieldId}`}
      </InputLabel>
      <Divider />

      <div
        className={[
          styles["field-row"],
          isFieldActive ? styles["field-row--active"] : "",
        ].join(" ")}
      >
        <RadioGroup
          name={htmlId}
          value={stringifyValue(data)}
          onChange={onRadioButtonChange}
          onFocus={onFocus}
        >
          <FormControlLabel value="yes" control={<Radio />} label={labelYes} />
          <FormControlLabel value="no" control={<Radio />} label={labelNo} />
          {isNullable ? (
            <FormControlLabel
              value="null"
              control={<Radio />}
              label={labelNull}
            />
          ) : null}
        </RadioGroup>

        {/* Buttons wrap, since there's a lot of them */}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {/* Reset to empty button */}
          {data !== undefined && (
            <Tooltip title={forgetTooltipLabel} disableInteractive>
              <IconButton
                onClick={() => handleChange(path, undefined)}
                sx={{ p: "10px" }}
              >
                <StreamIcon />
              </IconButton>
            </Tooltip>
          )}

          <HighlightPinButton />

          {/* Human validation in Multiselect groups is a little different
          semantics-wise. It is only done for fields predicted as "true",
          and ignored for others and ignored for the leader control when "true". */}
          {(data === false || data === null) && (
            <RobotButtons
              t={t}
              fieldId={fieldId}
              fieldPrediction={fieldPrediction}
            />
          )}
        </div>
      </div>
      {errors !== "" && (
        <FormHelperText className={styles["field-error-message"]} error={true}>
          {errors}
        </FormHelperText>
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

export const leaderControlTester: RankedTester = rankWith(2, isBooleanControl);

export const LeaderControl = withJsonFormsControlProps(
  withTranslateProps(React.memo(LeaderControlUnwrapped)),
);
