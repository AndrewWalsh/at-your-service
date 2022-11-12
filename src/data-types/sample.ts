import { isEqual, uniqWith } from "lodash";

/**
 * A data type that wraps logic around how samples are handled
 * To minimise disk use, sample properties are set to their zero value
 * E.g. string = "", number = 0, boolean = false, null = null
 * They can then be compared to other samples to see if they are equal
 * If they are equal, we don't need to store the sample
 */
export default class Sample {
  private sample: {};
  constructor(JSONInput: string) {
    try {
      this.sample = Sample.fromJSON(JSONInput);
    } catch (e) {
      console.warn(new Error(`Failed to parse JSON in Sample: ${JSON}`));
      console.error(e);
      this.sample = {};
    }
  }

  static create(JSONInput: string) {
    return new Sample(JSONInput);
  }

  getSample = () => {
    return this.sample;
  };

  isEqual = (other: Sample) => {
    const s1 = this.sample;
    const s2 = other.getSample();
    return isEqual(s1, s2);
  };

  toJSON = () => {
    return JSON.stringify(this.sample);
  };

  private toString = () => {
    return this.toJSON();
  };

  private static fromJSON(json: string): {} {
    const parsedJSON: {} = JSON.parse(json);

    // Valid data types for JSON are
    // string number object boolean array null
    // We can ignore null as that is always just null
    const setPropertiesToEmpty = (obj: {} | {}[]) => {
      for (const key in obj) {
        // Array is an object, so test it first
        if (Array.isArray(obj[key])) {
          setPropertiesToEmpty(obj[key]);
          // Remove duplicates after zeroing items in the array
          obj[key] = uniqWith(obj[key], isEqual);
          obj[key].sort();
        } else if (typeof obj[key] === "object") {
          setPropertiesToEmpty(obj[key]);
        } else if (typeof obj[key] === "string") {
          obj[key] = "";
        } else if (typeof obj[key] === "number") {
          obj[key] = 0;
        } else if (typeof obj[key] === "boolean") {
          // This is to ensure the value is always the same for sake of comparison
          obj[key] = true;
        }
      }
    };

    setPropertiesToEmpty(parsedJSON);
    return Object.freeze(parsedJSON);
  }
}
