import crypto from 'crypto'

describe('Unregister a Pass for Update Notifications', () => {

  it('401 error when authentication token missing in header', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Missing/empty header: Authorization')
    })
  })

  it('401 error when invalid authentication token in header', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/apple/v1/devices/cypress_b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Invalid header: Authorization')
    })
  })

  it('200 success when unregistering ', () => {
    const randomDeviceLibraryIdentifier : string = 'cypress_' + crypto.randomBytes(16).toString('hex')
    cy.request({
      method: 'DELETE',
      url: '/api/apple/v1/devices/' + randomDeviceLibraryIdentifier + '/registrations/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(JSON.stringify(response.body)).to.contain('Device Unregistered')
    })
  })
})

export {}
