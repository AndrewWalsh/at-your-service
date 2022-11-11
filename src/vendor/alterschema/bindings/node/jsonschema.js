import jsonschema, { setMetaOutputFormat, FLAG, add, validate, get } from '@hyperjump/json-schema'
import METASCHEMAS from '../../metaschemas.json'
setMetaOutputFormat(FLAG)

export const implementation = jsonschema

// TODO: This is a mock implementation. Ideally, we look at the metaschema
function usesVocabulary(_root, value, _vocabulary) {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true
  }

  return false
}

async function matches(schema, value) {
  const idProperty = METASCHEMAS[schema.$schema] === 'draft4' ? 'id' : '$id'
  add(schema)
  const result = await validate(get(schema[idProperty]), value)
  return result.valid
}

export default {
  usesVocabulary,
  matches,
}
