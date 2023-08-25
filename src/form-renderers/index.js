/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/

// ========== Controls ==========

import ResqMultiselectGroup, {
  resqMultiselectGroupTester,
  ResqMultiselectGroup as ResqMultiselectGroupUnwrapped
} from "./multiselect/ResqMultiselectGroup"

import ResqPostAcuteFindingsGroup, {
  resqPostAcuteFindingsGroupTester,
  ResqPostAcuteFindingsGroup as ResqPostAcuteFindingsGroupUnwrapped
} from "./post-acute-findings/PostAcuteFindingsGroup"


// ========== Export ==========

export const Unwrapped = {
  ResqMultiselectGroup: ResqMultiselectGroupUnwrapped,
  ResqPostAcuteFindingsGroup: ResqPostAcuteFindingsGroupUnwrapped
}

export {
  ResqMultiselectGroup,
  resqMultiselectGroupTester,
  ResqPostAcuteFindingsGroup,
  resqPostAcuteFindingsGroupTester
}
