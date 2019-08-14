import 'cypress-testing-library/add-commands'
describe('SongsStoriesView.js > SongsStoriesView', () => {
  it('FW-298: Broken buttons on Book page', () => {
    cy.login()
    cy.visit(
      "http://0.0.0.0:3001/nuxeo/app/explore/FV/Workspaces/Data/Demonstration/%7BDemonstration%7D/Alex's%20Demo/learn/stories/4d8ca4b9-58be-4b66-b94f-0066caf51a7d"
    )

    cy.getByText('add new page', { exact: false }).click()
    cy.getByText('Add New Entry To', { exact: false }).should('exist')
  })
})