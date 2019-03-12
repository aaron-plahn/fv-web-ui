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
import React, { Component, PropTypes } from "react"
// import ReactDOM from 'react-dom'
import provide from "react-redux-provide"
import selectn from "selectn"

// import classNames from 'classnames'

import ProviderHelpers from "common/ProviderHelpers"
// import StringHelpers from 'common/StringHelpers'
import UIHelpers from "common/UIHelpers"

// import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import AppFrontController from "./AppFrontController"

import Shepherd from "tether-shepherd"

// import FontIcon from 'material-ui/lib/font-icon'
// import Paper from 'material-ui/lib/paper'
// import FlatButton from 'material-ui/lib/flat-button'

import IntlService from "views/services/intl"

// const getPosition = function getPosition() {
//   const doc = document
//   const w = window
//   let x
//   let y
//   let docEl

//   if (typeof w.pageYOffset === 'number') {
//     x = w.pageXOffset
//     y = w.pageYOffset
//   } else {
//     docEl = doc.compatMode && doc.compatMode === 'CSS1Compat' ? doc.documentElement : doc.body
//     x = docEl.scrollLeft
//     y = docEl.scrollTop
//   }
//   return { x: x, y: y }
// }

/**
 * Finds the xPath for a component, leading up to the 'app-wrapper'.
 * Used as a utility for creating Shepherd tours
 */
function findComponentParents(_el) {
  let parents = []
  let el = _el
  const originalEl = el

  if (!el.getAttribute("data-component-id")) {
    return null
  }

  while (el.parentNode) {
    el = el.parentNode

    if (el.getAttribute("id") === "app-wrapper") {
      break
    }

    if (el.tagName) {
      const appendClass = el.className ? "." + el.className.replace(/\s/g, ".").replace(/\:/g, "\\:") : "" // eslint-disable-line
      const appendData = el.getAttribute("data-component-id")
        ? "[data-component-id='" + el.getAttribute("data-component-id") + "']"
        : ""

      parents.push(el.tagName.toLowerCase() + appendClass + appendData)
    }
  }

  parents = parents.reverse()
  parents.push(
    originalEl.tagName.toLowerCase() + "[data-component-id='" + originalEl.getAttribute("data-component-id") + "']"
  )

  return parents.join(" ")
}

const getPreferences = function getPreferences(login, dialect) {
  const preferenceString = selectn("response.properties.preferences", login)
  const parsedPreferences = preferenceString ? JSON.parse(preferenceString) : {}
  const flattenedPreferences = {}

  for (const preferenceCat in parsedPreferences) {
    for (const preference in parsedPreferences[preferenceCat]) {
      flattenedPreferences[preference] = parsedPreferences[preferenceCat][preference]
    }
  }

  // Dialect assignment
  flattenedPreferences.primary_dialect_path = selectn("path", dialect)

  return flattenedPreferences
}

@provide
class AppWrapper extends Component {
  intl = IntlService.instance
  intlBaseKey = "views"

  static propTypes = {
    connect: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    changeTheme: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  // react-redux-provide will pass context such as providers (Note: this is only needed for debugging the store atm)
  static contextTypes = {
    providers: PropTypes.object,
  }

  /**
   * Pass essential context to all children
   */
  getChildContext() {
    const newContext = {
      muiTheme: this.props.properties.theme.palette,
    }

    return newContext
  }

  constructor(props, context) {
    super(props, context)

    // Connect to Nuxeo
    this.props.connect()
    this.props.getCurrentUser()

    this.state = {
      adminGuideStarted: false,
      dialect: null,
    }

    // Bind methods to 'this'
    ;["_startAdminGuideAssist"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // Force update of theme if out of sync
  // This is a fix that may be unecessary in future versions of Material-UI, React, Reat-redux-provide
  componentWillReceiveProps(nextProps) {
    if (nextProps.properties.theme.id != this.props.properties.theme.id) {
      nextProps.changeTheme(nextProps.properties.theme.id)
    }
  }

  // Changing a theme manually...
  /*_changeTheme(event) {
      let index = event.nativeEvent.target.selectedIndex;
      this.props.changeTheme(event.target[index].value);
    }*/

  _startAdminGuideAssist() {
    const doms = document.querySelectorAll("[data-component-id]")

    const tour = new Shepherd.Tour({
      defaults: {
        classes: "shepherd-theme-arrows",
      },
    })

    document.onkeydown = function documentOnkeydown(_e) {
      const e = _e || window.event
      switch (e.which || e.keyCode) {
        case 37:
          tour.back()
          break

        case 39:
          tour.next()
          break
        default: // Note: do nothing
      }
    }

    doms.forEach(function domsForEach(dom, i) {
      const xpath = findComponentParents(dom)

      //if (!document.querySelector(xpath)) {
      //  console.log(xpath);
      //}

      if (xpath != null) {
        tour.addStep("step" + i, {
          title: "Element xPath",
          text: xpath + "<textarea>" + dom.textContent + "</textarea>",
          classes: "shepherd-theme-arrows admin-guide-step",
          attachTo: xpath + " bottom",
          showCancelLink: true,
          scrollTo: true,
          when: {
            show: () => {
              dom.style.border = "2px blue dashed"
            },
            hide: () => {
              dom.style.border = "initial"
            },
          },
        })
      }
    })

    this.setState({
      adminGuideStarted: true,
    })

    tour.start()
  }

  render() {
    // const controller = null

    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.state.dialect)

    const warnings = {}

    const preferences = getPreferences(this.props.computeLogin, selectn("response", computeDialect2))

    return (
      <div
        id="AppWrapper"
        style={{ backgroundColor: selectn("theme.palette.basePalette.wrapper.backgroundColor", this.props.properties) }}
        style={{ fontSize: UIHelpers.getPreferenceVal("font_size", preferences) }}
      >
        <AppFrontController preferences={preferences} warnings={warnings} />

        {/*<AuthorizationFilter filter={{
                role: ['Everything'],
                entity: selectn('response.entries[0]', dialects),
                login: this.props.computeLogin
            }}>
                <div className="row" style={{backgroundColor: '#406f85', textAlign: 'center', color: '#8caab8'}}>

                    {this.intl.translate({
                        key: 'super_admin_tools',
                        default: 'Super Admin Tools',
                        case: 'words'
                    })}: <FlatButton onTouchTap={this._startAdminGuideAssist.bind(this.props.windowPath)}
                                     disabled={this.state.adminGuideStarted} label={this.intl.translate({
                    key: 'admin_guide_assist',
                    default: 'Admin Guide Assist', case: 'words'
                })}/>
                    {(this.state.adminGuideStarted) ? this.intl.translate({
                        key: 'only_one_tour_per_page',
                        default: 'You can only run one tour per page. Navigate to another page and remember to hit \'Refresh\'',
                        case: 'first'
                    }) : ''}

                </div>
            </AuthorizationFilter>*/}
      </div>
    )
  }
}

export default AppWrapper
