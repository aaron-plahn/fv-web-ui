/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component, PropTypes } from 'react'
import Immutable, { List, is } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchBook, fetchBookEntries, updateBook, updateBookEntry } from 'providers/redux/reducers/fvBook'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'

import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

// Models
import { Document } from 'nuxeo'

// Views
import BookEntryEdit from 'views/pages/explore/dialect/learn/songs-stories/entry/edit'
import BookEntryList from 'views/pages/explore/dialect/learn/songs-stories/entry/list-view'

import Dialog from 'material-ui/lib/dialog'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const DEFAULT_LANGUAGE = 'english'

const DEFAULT_SORT_ORDER = '&sortOrder=asc,asc&sortBy=fvbookentry:sort_map,dc:created'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class PageDialectBookEdit extends Component {
  static propTypes = {
    book: object,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    computeBook: object.isRequired,
    computeBookEntries: object.isRequired,
    computeDialect2: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchBook: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchBookEntries: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateBook: func.isRequired,
    updateBookEntry: func.isRequired,
  }
  state = {
    editPageDialogOpen: false,
    editPageItem: null,
    formValue: null,
    sortedItems: List(),
    componentState: STATE_LOADING,
  }

  // Redirect on success
  componentDidUpdate(prevProps) {
    let currentBook
    let nextBook

    if (this._getBookPath() !== null) {
      currentBook = ProviderHelpers.getEntry(prevProps.computeBook, this._getBookPath())
      nextBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
    }

    if (
      selectn('wasUpdated', currentBook) != selectn('wasUpdated', nextBook) &&
      selectn('wasUpdated', nextBook) === true
    ) {
      // 'Redirect' on success
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.theme, selectn('response', nextBook), 'songs-stories'),
        this.props.replaceWindowPath,
        true
      )
    } else {
      const book = selectn('response', ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath()))
      const title = selectn('properties.dc:title', book)
      const uid = selectn('uid', book)

      if (title && selectn('pageTitleParams.bookName', this.props.properties) != title) {
        this.props.changeTitleParams({ bookName: title })
        this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.bookName' })
      }
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData()
  }

  // NOTE: Fixes FW-692
  // When clicking most tcomb-form buttons a rerender is triggered for some reason.
  // If the rerender is allowed to continue, the outcome of the click will never be realized.
  // When that happens we end up with buttons appearing to not be responsive and dialogs never being displayed.
  //
  // That's why we are preventing unnecessary renders from happening below
  shouldComponentUpdate(newProps, newState) {
    const isSameComputeBook = is(newProps.computeBook, this.props.computeBook)
    const isSameComputeDialect = is(newProps.computeDialect2, this.props.computeDialect2)
    const isSameComputeBookEntries = is(newProps.computeBookEntries, this.props.computeBookEntries)
    const isSameState = is(newState, this.state)

    if (isSameComputeBook && isSameComputeDialect && isSameComputeBookEntries && isSameState) {
      return false
    }
    return true
  }

  render() {
    const content = this._getContent()
    return content
  }

  _getContent = () => {
    let content = null
    switch (this.state.componentState) {
      case STATE_DEFAULT: {
        content = this._stateGetDefault()
        break
      }
      default:
        content = this._stateGetLoading()
    }
    return content
  }
  fetchData = async () => {
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)

    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    if (_computeDialect2.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: _computeDialect2.message,
      })
      return
    }

    await this.props.fetchBook(this._getBookPath())
    await this.props.fetchBookEntries(this._getBookPath(), DEFAULT_SORT_ORDER)

    this.setState({
      componentState: STATE_DEFAULT,
      errorMessage: undefined,
    })
  }

  _handleSave = (book, formValue) => {
    const newDocument = new Document(book.response, {
      repository: book.response._repository,
      nuxeo: book.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateBook(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel = () => {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.pushWindowPath)
  }

  _storeSortOrder = (items) => {
    this.setState({
      sortedItems: items,
    })
  }

  _editPage = (item) => {
    this.setState({ editPageDialogOpen: true, editPageItem: item })
  }

  _getBookPath = (props = null) => {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.bookName)) {
      return _props.routeParams.bookName
    }
    return _props.routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(_props.routeParams.bookName)
  }

  _pageSaved = () => {
    // Ensure update is complete before re-fetch.
    setTimeout(
      function pageSavedSetTimeout() {
        this.props.fetchBookEntries(this._getBookPath(), DEFAULT_SORT_ORDER)
      }.bind(this),
      500
    )
    this.setState({ editPageDialogOpen: false, editPageItem: null })
  }

  _stateGetDefault = () => {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getBookPath(),
        entity: this.props.computeBook,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this._getBookPath(),
        entity: this.props.computeBookEntries,
      },
    ])

    const _computeBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
    const _computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this._getBookPath())
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', _computeDialect2) && selectn('response', _computeBook)) {
      const providedFilter =
        selectn('response.properties.fv-phrase:definitions[0].translation', _computeBook) ||
        selectn('response.properties.fv:literal_translation[0].translation', _computeBook)
      context = Object.assign(selectn('response', _computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', _computeBook),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <AuthenticationFilter
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <div>
          <Tabs>
            <Tab label={intl.trans('book', 'Book', 'first')}>
              <h1>
                {intl.trans(
                  'views.pages.explore.dialect.learn.songs_stories.edit_x_book',
                  'Edit ' + selectn('response.properties.dc:title', _computeBook) + ' Book',
                  'words',
                  [selectn('response.properties.dc:title', _computeBook)]
                )}
              </h1>
              <EditViewWithForm
                computeEntities={computeEntities}
                initialValues={context}
                itemId={this._getBookPath()}
                fields={fields}
                options={options}
                saveMethod={this._handleSave}
                cancelMethod={this._handleCancel}
                currentPath={this.props.splitWindowPath}
                navigationMethod={this.props.pushWindowPath}
                type="FVBook"
                routeParams={this.props.routeParams}
              />
            </Tab>
            <Tab label={intl.trans('pages', 'Pages', 'first')}>
              <h1>
                {intl.trans('', 'Edit ' + selectn('response.properties.dc:title', _computeBook) + ' pages', 'first', [
                  selectn('response.properties.dc:title', _computeBook),
                ])}
              </h1>
              <BookEntryList
                reorder
                sortOrderChanged={this._storeSortOrder}
                defaultLanguage={DEFAULT_LANGUAGE}
                editAction={this._editPage}
                innerStyle={{ minHeight: 'inherit' }}
                metadata={selectn('response', _computeBookEntries) || {}}
                items={selectn('response.entries', _computeBookEntries) || []}
              />
            </Tab>
          </Tabs>

          <Dialog
            autoScrollBodyContent
            style={{ zIndex: 0 }}
            overlayStyle={{ background: 'none' }}
            open={this.state.editPageDialogOpen}
            onRequestClose={() => this.setState({ editPageDialogOpen: false })}
          >
            <BookEntryEdit
              entry={this.state.editPageItem}
              handlePageSaved={this._pageSaved}
              dialectEntry={_computeDialect2}
              {...this.props}
            />
          </Dialog>
        </div>
      </AuthenticationFilter>
    )
  }

  _stateGetLoading = () => {
    return <StateLoading copy={this.state.copy} />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, navigation, nuxeo, windowPath } = state

  const { computeBook, computeBookEntries } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { properties } = navigation
  const { computeLogin } = nuxeo

  return {
    computeBook,
    computeBookEntries,
    computeDialect2,
    computeLogin,
    properties,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchBook,
  fetchDialect2,
  fetchBookEntries,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  updateBook,
  updateBookEntry,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectBookEdit)
