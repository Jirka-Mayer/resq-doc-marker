import React from "react"
import { rankWith, toDataPath, toDataPathSegments } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps, withTranslateProps } from '@jsonforms/react'
import { isMultiselectGroup } from './isMultiselectGroup'
import { Divider, FormHelperText, InputLabel, Paper } from '@mui/material'
import LeaderControl, { leaderControlTester } from "./LeaderControl"
import BodyVerticalLayout, { bodyVerticalLayoutTester } from './BodyVerticalLayout'
import BodyGroupLayout, { bodyGroupLayoutTester } from './BodyGroupLayout'
import BodyCheckboxControl, { bodyCheckboxControlTester } from './BodyCheckboxControl'
import { MultiselectGroupContext } from "./MultiselectGroupContext"
import _ from "lodash"
import { useMemo } from 'react'

// DocMarker API imports
import { stateApi, formApi } from "doc-marker"
const useGetExportedValue = stateApi.formStore.useGetExportedValue
const { dmLinearLayoutTester, DmLinearLayout } = formApi.renderers
const styles = formApi.rendererStyles

function leaderScopeToGroupPath(scope) {
  const segments = toDataPathSegments(scope)
  segments.pop()
  return segments.join(".")
}

function leaderScopeToLeaderKey(scope) {
  const segments = toDataPathSegments(scope)
  return segments.pop()
}

function allCheckboxesAreFalse(data, groupPath, leaderKey) {
  const groupData = _.get(data, groupPath)
  
  for (const key in groupData) {
    if (key === leaderKey)
      continue

    if (typeof groupData[key] === "object") {
      if (!allCheckboxesAreFalse(data, groupPath + "." + key, null))
        return false
    } else {
      if (groupData[key] === true)
        return false
    }
  }

  return true
}

const leaderRenderers = [
  { tester: leaderControlTester, renderer: LeaderControl }
]
const leaderCells = []
const bodyRenderers = [
  // special vertical layout, because the checkboxes are closer together
  // than in normal layout
  { tester: bodyVerticalLayoutTester, renderer: BodyVerticalLayout },
  // for horizontal layout, use the DocMarker linear layout
  // Do not use material layout, because it does some smart non-rendering
  // of invisible items, which breaks the form data exporting system.
  { tester: dmLinearLayoutTester, renderer: DmLinearLayout },
  
  { tester: bodyGroupLayoutTester, renderer: BodyGroupLayout },
  { tester: bodyCheckboxControlTester, renderer: BodyCheckboxControl }
]
const bodyCells = []

export function ResqMultiselectGroup(props) {
  const {
    schema,
    uischema,
    visible,
    data,
    t,
  } = props

  const leaderUischema = uischema.elements[0]
  const leaderPath = toDataPath(leaderUischema.scope) // foo.bar.medication_any
  const leaderKey = leaderScopeToLeaderKey(leaderUischema.scope) // medication_any
  const groupPath = leaderScopeToGroupPath(leaderUischema.scope) // foo.bar
  const leaderValue = useGetExportedValue(leaderPath)

  const bodyUischema = uischema.elements[1]
  

  ///////////////
  // Rendering //
  ///////////////
  
  let errors = ""

  const atLeastOneError = useMemo(() => t(
    leaderPath + ".error.multiselect",
    "Select at least one of following",
    { schema, leaderUischema, leaderPath}
  ), [t, schema, leaderUischema, leaderPath])

  if (leaderValue === true && allCheckboxesAreFalse(data, groupPath, leaderKey)) {
    errors = atLeastOneError
  }

  return (
    <MultiselectGroupContext.Provider value={{
      leaderValue: leaderValue,
      leaderPath: leaderPath,
      inSubGroup: false
    }}>
      <Paper sx={{ display: visible ? "block" : "none" }}>
        <JsonFormsDispatch
          uischema={leaderUischema}
          schema={schema}
          enabled={true} // we do not support being disabled
          renderers={leaderRenderers}
          cells={leaderCells}
        />

        { (leaderValue === true) &&
          <Divider />
        }

        <JsonFormsDispatch
          uischema={bodyUischema}
          schema={schema}
          enabled={true} // checkboxes handle that on their own
          renderers={bodyRenderers}
          cells={bodyCells}
        />
        
        {/* <pre>{ JSON.stringify(_.get(data, groupPath), null, 2) }</pre> */}

        { (errors !== "") &&
          <FormHelperText
            className={styles["field-error-message"]}
            error={true}
          >{errors}</FormHelperText>
        }
      </Paper>
    </MultiselectGroupContext.Provider>
  )
}

export const resqMultiselectGroupTester = rankWith(
  10, isMultiselectGroup
)

export default withJsonFormsLayoutProps(
  withTranslateProps(
    React.memo(ResqMultiselectGroup)
  )
)
