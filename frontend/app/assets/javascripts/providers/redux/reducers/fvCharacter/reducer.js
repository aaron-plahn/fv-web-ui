import { computeFetch, computeQuery } from 'providers/redux/reducers/rest'

import { combineReducers } from 'redux'

const computeCharacterFetchFactory = computeFetch('character')
const computeCharactersQueryFactory = computeQuery('characters')

export const fvCharacterReducer = combineReducers({
  computeCharacter: computeCharacterFetchFactory.computeCharacter,
  computeCharacters: computeCharactersQueryFactory.computeCharacters,
})
