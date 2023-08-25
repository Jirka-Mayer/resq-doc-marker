import { resqMultiselectGroupTester, ResqMultiselectGroup } from "./form-renderers"
import { resqPostAcuteFindingsGroupTester, ResqPostAcuteFindingsGroup } from "./form-renderers"

export const formRenderers = [
  { tester: resqMultiselectGroupTester, renderer: ResqMultiselectGroup },
  { tester: resqPostAcuteFindingsGroupTester, renderer: ResqPostAcuteFindingsGroup },
]

export const formCells = []
