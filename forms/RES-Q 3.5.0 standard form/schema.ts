import schema from "./schema.json";
import { UiSchemaMapperBase, ArrayFragment } from "../UiSchemaMapperBase";

/*
  This file loads the uischema.json, but modifies it so that it renders better
  in DocMarker. It may also correct mistakes in the form, that do not show
  up in RES-Q, but do in DocMarker. Therefore this file is a documentation
  of all the performed changes.
*/

// we'll use the UI schema mapper for data schema, but it does not matter
class Resq350Mapper extends UiSchemaMapperBase {
  public mapElement(element: any): any {
    // remove "formatMinimum" values as they use references to other fields,
    // which requires AJV features not present in DocMarker.
    if (this.isPojo && typeof element.formatMinimum === "object") {
      const mappedElement = super.mapElement(element);
      mappedElement.formatMinimum = undefined;
      return mappedElement;
    }

    // fallback on the recursive default case
    return super.mapElement(element);
  }
}

const mappedDataSchema = new Resq350Mapper().map(schema);

export default mappedDataSchema;
