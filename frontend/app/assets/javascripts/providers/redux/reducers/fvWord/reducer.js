import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_WORDS_SHARED_FETCH_START,
  FV_WORDS_SHARED_FETCH_SUCCESS,
  FV_WORDS_SHARED_FETCH_ERROR,
  FV_WORD_FETCH_ALL_START,
  FV_WORD_FETCH_ALL_SUCCESS,
  FV_WORD_FETCH_ALL_ERROR,
  FV_WORDS_USER_MODIFIED_QUERY_START,
  FV_WORDS_USER_MODIFIED_QUERY_SUCCESS,
  FV_WORDS_USER_MODIFIED_QUERY_ERROR,
  FV_WORDS_USER_CREATED_QUERY_START,
  FV_WORDS_USER_CREATED_QUERY_SUCCESS,
  FV_WORDS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

const initialState = {
  isFetching: false,
  response: {
    get: () => '',
  },
  success: false,
}
const computeWordFetchFactory = RESTReducers.computeFetch('word')
const computeWordDeleteFactory = RESTReducers.computeDelete('delete_word')
const computeWordEnableOperationFactory = RESTReducers.computeOperation('word_enable_workflow')
const computeWordDisableOperationFactory = RESTReducers.computeOperation('word_disable_workflow')

const computeWordsQueryFactory = RESTReducers.computeQuery('words')
const computeRecentlyModifiedWordsQuery = RESTReducers.computeQuery('modified_words')
const computeRecentlyCreatedWordsQuery = RESTReducers.computeQuery('created_words')

export const fvWordReducer = combineReducers({
  computeSharedWords(state = initialState, action) {
    switch (action.type) {
      case FV_WORDS_SHARED_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_WORDS_SHARED_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_WORDS_SHARED_FETCH_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: action.type === DISMISS_ERROR ? true : false,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeWord: computeWordFetchFactory.computeWord,
  computeWords: computeWordsQueryFactory.computeWords,
  computeDeleteWord: computeWordDeleteFactory.computeDeleteWord,
  computeWordEnableWorkflow: computeWordEnableOperationFactory.computeWordEnableWorkflow,
  computeWordDisableWorkflow: computeWordDisableOperationFactory.computeWordDisableWorkflow,
  computeWordsAll(state = initialState, action) {
    switch (action.type) {
      case FV_WORD_FETCH_ALL_START:
        return { ...state, isFetching: true, success: false }

      case FV_WORD_FETCH_ALL_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case FV_WORD_FETCH_ALL_ERROR: // NOTE: intentional fallthrough
      case DISMISS_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: action.type === DISMISS_ERROR ? true : false,
        }

      default:
        return { ...state, isFetching: false }
    }
  },

  computeModifiedWords: computeRecentlyModifiedWordsQuery.computeModifiedWords,
  computeCreatedWords: computeRecentlyCreatedWordsQuery.computeCreatedWords,
  computeUserModifiedWords(state = initialState, action) {
    switch (action.type) {
      case FV_WORDS_USER_MODIFIED_QUERY_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_MODIFIED_QUERY_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_MODIFIED_QUERY_ERROR: // NOTE: intentional fallthrough
      case DISMISS_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: action.type === DISMISS_ERROR ? true : false,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeUserCreatedWords(state = initialState, action) {
    switch (action.type) {
      case FV_WORDS_USER_CREATED_QUERY_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_CREATED_QUERY_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_CREATED_QUERY_ERROR: // NOTE: intentional fallthrough
      case DISMISS_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: action.type === DISMISS_ERROR ? true : false,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
})
