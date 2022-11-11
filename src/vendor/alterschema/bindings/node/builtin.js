import DRAFT4_TO_DRAFT4 from '../../rules/jsonschema-draft4-to-draft4.json'
import DRAFT4_TO_DRAFT6 from '../../rules/jsonschema-draft4-to-draft6.json'
import DRAFT6_TO_DRAFT7 from '../../rules/jsonschema-draft6-to-draft7.json'
import DRAFT6_TO_DRAFT6 from '../../rules/jsonschema-draft6-to-draft6.json'
import DRAFT7_TO_V2019_09 from '../../rules/jsonschema-draft7-to-2019-09.json'
import DRAFT7_TO_DRAFT7 from '../../rules/jsonschema-draft7-to-draft7.json'
import V2019_09_TO_V2020_12 from '../../rules/jsonschema-2019-09-to-2020-12.json'
import V2019_09_TO_V2019_09 from '../../rules/jsonschema-2019-09-to-2019-09.json'
import V2020_12_TO_V2020_12 from '../../rules/jsonschema-2020-12-to-2020-12.json'

// TODO: Find a way to specify transitiveness in a less verbose manner
const jsonschema = {
  draft4: {
    draft6: [DRAFT4_TO_DRAFT4, DRAFT4_TO_DRAFT6, DRAFT6_TO_DRAFT6],
    draft7: [DRAFT4_TO_DRAFT4, DRAFT4_TO_DRAFT6, DRAFT6_TO_DRAFT6, DRAFT6_TO_DRAFT7, DRAFT7_TO_DRAFT7],
    '2019-09': [DRAFT4_TO_DRAFT4, DRAFT4_TO_DRAFT6, DRAFT6_TO_DRAFT6, DRAFT6_TO_DRAFT7, DRAFT7_TO_DRAFT7, DRAFT7_TO_V2019_09, V2019_09_TO_V2019_09],
    '2020-12': [DRAFT4_TO_DRAFT4, DRAFT4_TO_DRAFT6, DRAFT6_TO_DRAFT6, DRAFT6_TO_DRAFT7, DRAFT7_TO_DRAFT7, DRAFT7_TO_V2019_09, V2019_09_TO_V2019_09, V2019_09_TO_V2020_12, V2020_12_TO_V2020_12]
  },
  draft6: {
    draft7: [DRAFT6_TO_DRAFT6, DRAFT6_TO_DRAFT7, DRAFT7_TO_DRAFT7],
    '2019-09': [DRAFT6_TO_DRAFT6, DRAFT6_TO_DRAFT7, DRAFT7_TO_DRAFT7, DRAFT7_TO_V2019_09, V2019_09_TO_V2019_09],
    '2020-12': [DRAFT6_TO_DRAFT6, DRAFT6_TO_DRAFT7, DRAFT7_TO_DRAFT7, DRAFT7_TO_V2019_09, V2019_09_TO_V2019_09, V2019_09_TO_V2020_12, V2020_12_TO_V2020_12]
  },
  draft7: {
    '2019-09': [DRAFT7_TO_DRAFT7, DRAFT7_TO_V2019_09, V2019_09_TO_V2019_09],
    '2020-12': [DRAFT7_TO_DRAFT7, DRAFT7_TO_V2019_09, V2019_09_TO_V2019_09, V2019_09_TO_V2020_12, V2020_12_TO_V2020_12]
  },
  '2019-09': {
    '2020-12': [V2019_09_TO_V2019_09, V2019_09_TO_V2020_12, V2020_12_TO_V2020_12]
  }
}

export default { jsonschema }
