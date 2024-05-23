/**
 * Returns true if the given value is a plain javascript object (JSON object)
 */
export function isPOJO(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

/**
 * Represents a fragment of an array, that can be returned when
 * mapping an array element into multiple elements
 */
export class ArrayFragment {
  /**
   * @param {Array} items 
   */
  constructor(items) {
    this.items = items
  }
}

/**
 * Base class for a UI Schema mapper
 * Override the mapElement function which should be recursively called
 * on each schema element. It returns the mapped version of the element.
 * Call the super implementation of mapElement to run recursion on
 * non-interesting elements. Perform your own mapping on interesting elements.
 * To recursively map a subset of an interesting element, call the recurseVia
 * function to properly update the tracked state (path and stack).
 */
export class UiSchemaMapperBase {
  constructor() {
    /**
     * The UI schema provided on the input
     */
    this.inputUiSchema = null

    /**
     * Path of keys and indices through the input schema
     */
    this.path = []

    /**
     * Parent schema objects and arrays corresponding to the current path
     */
    this.stack = []

    /**
     * Is the currently mapped element a plain javascript object?
     */
    this.isPojo = false

    /**
     * Is the currently mapped element an array?
     */
    this.isArray = false

    /**
     * Length of the current array or number of keys in the current object
     * or zero if a scalar value (even if string!)
     */
    this.elementLength = 0
  }

  get stringPath() {
    return this.path.join(".")
  }

  map(uiSchema) {
    this.uiSchema = uiSchema;
    this.path = []
    this.stack = [uiSchema]

    this.preMapElement(uiSchema)
    return this.mapElement(uiSchema)
  }

  preMapElement(element) {
    this.isPojo = isPOJO(element)
    this.isArray = Array.isArray(element)

    if (this.isPojo) {
      this.elementLength = Object.keys(element).length
    } else if (this.isArray) {
      this.elementLength = element.length
    } else {
      this.elementLength = 0
    }
  }

  mapElement(element) {

    // recursively map objects
    if (this.isPojo) {
      const mappedObject = {}
      for (const key in element) {
        const mappedField = this.recurseVia(key)
        if (mappedField !== undefined) {
          mappedObject[key] = mappedField
        }
      }
      return mappedObject
    }

    // recursively map arrays
    if (this.isArray) {
      const mappedArray = []
      for (let i = 0; i < element.length; i++) {
        const mappedItem = this.recurseVia(i)
        if (mappedItem === undefined) {
          // do nothing
        } else if (mappedItem instanceof ArrayFragment) {
          // push array fragment
          for (const item of mappedItem.items) {
            mappedArray.push(item)
          }
        } else {
          // push mapped array item
          mappedArray.push(mappedItem)
        }
      }
      return mappedArray;
    }

    // keep scalars unmodified
    return element;
  }

  recurseVia(keyOrIndex) {
    const element = this.stack[this.stack.length - 1]
    
    this.path.push(keyOrIndex)
    this.stack.push(element[keyOrIndex])

    this.preMapElement(element[keyOrIndex])
    const mappedValue = this.mapElement(element[keyOrIndex])
    
    this.path.pop()
    this.stack.pop()
    
    return mappedValue
  }
}
