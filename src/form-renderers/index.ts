/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/

// ========== Controls ==========

import {
  resqMultiselectGroupTester,
  ResqMultiselectGroup,
  ResqMultiselectGroupUnwrapped,
} from "./multiselect/ResqMultiselectGroup";

import {
  resqPostAcuteFindingsGroupTester,
  ResqPostAcuteFindingsGroup,
  ResqPostAcuteFindingsGroupUnwrapped,
} from "./post-acute-findings/PostAcuteFindingsGroup";

// ========== Export ==========

export const Unwrapped = {
  ResqMultiselectGroup: ResqMultiselectGroupUnwrapped,
  ResqPostAcuteFindingsGroup: ResqPostAcuteFindingsGroupUnwrapped,
};

export {
  ResqMultiselectGroup,
  resqMultiselectGroupTester,
  ResqPostAcuteFindingsGroup,
  resqPostAcuteFindingsGroupTester,
};
