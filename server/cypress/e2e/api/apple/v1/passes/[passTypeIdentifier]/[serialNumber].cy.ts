import crypto from 'crypto'
import { AppleCryptoUtils } from '../../../../../../../utils/AppleCryptoUtils'

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

  it('error when invalid authentication token in header', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/passes/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Invalid header: Authorization')
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
        'Authorization': 'ApplePass 0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab'
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
      'Authorization': 'ApplePass 0xe31bcc7bf703fe106a757e41df3ba761daac89cb007cebfcce8ab3b3efa803b0'
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(500)
    expect(JSON.stringify(response.body)).to.contain('multiple (or no) rows returned')
  })
})

export {}
