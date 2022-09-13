import crypto from 'crypto'

describe('Send an Updated Pass', () => {

  it('error when wrong request method (POST instead of GET)', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/passes/pass.org.passport.nation3/5',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Wrong request method')
    })
  })

  it('error when authentication token missing in header', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/passes/pass.org.passport.nation3/5',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Missing/empty header: Authorization')
    })
  })
  
  /**
   * A passport with ID 5 is expected to have been downloaded previously (see downloadPass.cy.ts).
   */
  it('success when valid authentication token in header', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/passes/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x3fbeb3ae33af3fb33f3d33333303d333a333aff33f3133efbc3330333adb333a'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers).to.include({
        'content-type': 'application/vnd.apple.pkpass'
      })
    })
  })
})

it('error when serial number missing from `downloads` table', () => {
  cy.request({
    method: 'GET',
    url: '/api/apple/v1/passes/pass.org.passport.nation3/55555',
    headers: {
      'Authorization': 'ApplePass 0x3fbeb3ae33af3fb33f3d33333303d333a333aff33f3133efbc3330333adb333a'
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(500)
    expect(JSON.stringify(response.body)).to.contain('multiple (or no) rows returned')
  })
})

export {}
