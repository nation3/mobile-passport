import crypto from 'crypto'

describe('Send an Updated Pass', () => {

  it('error when wrong request method (POST instead of GET)', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/passes/pass.org.passport.nation3/333',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Wrong request method')
    })
  })

  it('error when authentication token missing in header', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/passes/pass.org.passport.nation3/333',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Missing/empty header: Authorization')
    })
  })
})

export {}
