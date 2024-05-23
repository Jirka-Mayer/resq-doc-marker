import uischema from "./uischema.json"
import { UiSchemaMapperBase, ArrayFragment } from "../UiSchemaMapperBase"

/*
  This file loads the uischema.json, but modifies it so that it renders better
  in DocMarker. It may also correct mistakes in the form, that do not show
  up in RES-Q, but do in DocMarker. Therefore this file is a documentation
  of all the performed changes.
*/

class Resq311Mapper extends UiSchemaMapperBase {
  mapElement(element) {
    // remove empty controls and vertical layouts
    if (
      this.isPojo
      && (element.type === "Control" || element.type === "VerticalLayout")
      && this.elementLength == 1
    ) {
      return undefined
    }

    // split onset date-time into date and time controls
    // (the less-painful solution, otherwise a $ref parsing would need
    // to be added, or a custom date-time component implemented)
    if (
      this.isPojo
      && element.type === "Control"
      && element.scope === "#/properties/onset/properties/onset_date"
    ) {
      return new ArrayFragment([
        {
          // the "date" control
          ...element,
          options: undefined
        },
        {
          // the "time" control
          ...element,
          scope: element.options["$ref"],
          options: undefined,
          i18n: "onset.onset_date" // both having the same label
        }
      ])
    }

    // fix "Group" instead of "VerticalLayout" wrapper for
    // discharge.medication.any_treatment_prescribed
    if (
      this.isPojo
      && element.type === "VerticalLayout"
      && Array.isArray(element.elements)
      && element.elements.length > 0
      && element.elements[0].scope === "#/properties/discharge/properties/" +
        "medication/properties/any_treatment_prescribed"
    ) {
      const mappedElement = super.mapElement(element);
      mappedElement.type = "Group"
      return mappedElement
    }

    // fix diagnosis.imaging.old_infarcts.any_infarct to become
    // a true multiselect
    if (
      this.isPojo
      && element.type === "Control"
      && element.scope === "#/properties/diagnosis/properties/imaging/" +
        "properties/old_infarcts/properties/any_infarct"
    ) {
      const mappedElement = super.mapElement(element);
      mappedElement.options = {
        multiselect: true,
        multiselectAllowNone: true // it can be that no box is checked
      }
      return mappedElement
    }

    // fix "diagnosis.imaging.occlusion.any_occlusion" multiselect,
    // flatten the 2D control structure into a simple vertical list
    if (
      this.isPojo
      && element.type === "Group"
      && Array.isArray(element.elements)
      && element.elements.length > 0
      && element.elements[0].scope === "#/properties/diagnosis/properties" +
        "/imaging/properties/occlusion/properties/any_occlusion"
    ) {
      const controls = []
      for (let column of element.elements[1].elements) {
        for (let control of column.elements) {
          controls.push(control)
        }
      }
      return {
        ...element,
        elements: [
          element.elements[0],
          {
            ...element.elements[1],
            type: "VerticalLayout", // change the type to vertical
            elements: controls // use the flattened controls
          }
        ]
      }
    }

    // wrap each 3+-column layout into a 2-column layout
    const MAX_WIDTH = 2
    if (
      this.isPojo
      && element.type === "HorizontalLayout"
      && Array.isArray(element.elements)
      && element.elements.length > MAX_WIDTH
    ) {
      const mappedElement = super.mapElement(element);
      const wrappedRows = []
      for (let i = 0; i < mappedElement.elements.length; i += MAX_WIDTH) {
        const items = mappedElement.elements.slice(i, i + MAX_WIDTH)
        if (items.length === 0) {
          break;
        }
        wrappedRows.push({
          ...mappedElement, // keep all other options (not that there are any...)
          type: "HorizontalLayout",
          elements: items
        })
      }
      return new ArrayFragment(wrappedRows)
    }

    // fallback on the recursive default case
    return super.mapElement(element);
  }
}

const mappedUiSchema = new Resq311Mapper().map(uischema);

export default mappedUiSchema
