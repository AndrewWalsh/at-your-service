import jsonDraft6 from "../../walkers/jsonschema-draft6.json"
import jsonDraft7 from "../../walkers/jsonschema-draft7.json"
import json2019 from "../../walkers/jsonschema-2019-09.json"
import json2020 from "../../walkers/jsonschema-2020-12.json"

import _ from "lodash"
import jsonschema from "./jsonschema"

// const jsonDraft6 = require('../../walkers/jsonschema-draft6.json')
// const jsonDraft7 = require('../../walkers/jsonschema-draft7.json')
// const json2019 = require('../../walkers/jsonschema-2019-09.json')
// const json2020 = require('../../walkers/jsonschema-2020-12.json')

const allWalkers = {
  jsonDraft6,
  jsonDraft7,
  json2019,
  json2020,
}

export default (walker, root, path) => {
  const value = path.length === 0 ? root : _.get(root, path)
  return _.reduce(allWalkers[walker], (accumulator, definition, keyword) => {
    if (typeof value[keyword] === 'undefined' || !jsonschema.usesVocabulary(root, value, definition.vocabulary)) {
      return accumulator
    }

    for (const type of _.castArray(definition.type)) {
      if (type === 'array' && Array.isArray(value[keyword])) {
        // eslint-disable-next-line no-unused-vars
        for (const [index, _item] of value[keyword].entries()) {
          accumulator.push(...module.exports(definition.walker, root, path.concat([keyword, index])))
        }
      } else if (type === 'object' && _.isPlainObject(value[keyword])) {
        for (const key of Object.keys(value[keyword])) {
          accumulator.push(...module.exports(definition.walker, root, path.concat([keyword, key])))
        }
      } else if (type === 'value' && !Array.isArray(value[keyword])) {
        accumulator.push(...module.exports(definition.walker, root, path.concat([keyword])))
      }
    }

    return accumulator
  }, [{ type: walker, path }])
}
