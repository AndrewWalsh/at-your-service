import { isEqual, uniqWith } from "lodash";
// Returns the JSON string equivalent of a zero value for the given primitive
const setPrimitiveToEmpty = (value) => {
  if (typeof value === "string") {
    return '""';
  } else if (typeof value === "number") {
    return 0;
  } else if (typeof value === "boolean") {
    // This is to ensure the value is always the same for sake of comparison
    return true;
  }
  return null;
};
// Valid data types for JSON are
// string number object boolean array null
// We can ignore null as that is always just null
const setObjOrArrPropertiesToEmpty = (obj) => {
  for (const key in obj) {
    // Array is an object, so test it first
    if (Array.isArray(obj[key])) {
      setObjOrArrPropertiesToEmpty(obj[key]);
      // Remove duplicates after zeroing items in the array
      obj[key] = uniqWith(obj[key], isEqual);
      obj[key].sort();
    } else if (typeof obj[key] === "object") {
      setObjOrArrPropertiesToEmpty(obj[key]);
    } else {
      obj[key] = setPrimitiveToEmpty(obj[key]);
    }
  }
};
/**
 * A data type that wraps logic around how samples are handled
 * To minimise disk use, sample properties are set to their zero value
 * E.g. string = "", number = 0, boolean = false, null = null
 * They can then be compared to other samples to see if they are equal
 * If they are equal, we don't need to store the sample
 */
export default class Sample {
  constructor(JSONInput) {
    Object.defineProperty(this, "sample", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "getSample", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return this.sample;
      },
    });
    Object.defineProperty(this, "isEqual", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        const s1 = this.sample;
        const s2 = other.getSample();
        return isEqual(s1, s2);
      },
    });
    Object.defineProperty(this, "toJSON", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return JSON.stringify(this.sample);
      },
    });
    Object.defineProperty(this, "toString", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return this.toJSON();
      },
    });
    try {
      this.sample = Sample.fromJSON(JSONInput);
    } catch (e) {
      console.warn(new Error(`Failed to parse JSON in Sample: ${JSON}`));
      console.error(e);
      this.sample = Object.create(null);
    }
  }
  static create(JSONInput) {
    return new Sample(JSONInput);
  }
  static fromJSON(json) {
    const parsedJSON = JSON.parse(json);
    if (
      ["string", "number", "boolean"].includes(typeof parsedJSON) ||
      parsedJSON === null
    ) {
      // @ts-expect-error
      return setPrimitiveToEmpty(parsedJSON);
    }
    setObjOrArrPropertiesToEmpty(parsedJSON);
    return Object.freeze(parsedJSON);
  }
}
