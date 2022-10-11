import crypto from 'crypto'

describe('Register a Pass for Update Notifications', () => {

  it('error when wrong request method (GET instead of POST)', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Wrong request method')
    })
  })

  it('error when authentication token missing in header', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Missing/empty header: Authorization')
    })
  })

  it('error when invalid authentication token in header', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Invalid header: Authorization')
    })
  })

  it('error when push token missing in body', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Missing/empty body: pushToken')
    })
  })

  /**
   * Note:  For this test to work, a matching device_library_identifier must already exist in the database table.
   */
  it('error when deviceLibraryIdentifier is already registered', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/cypress_b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab'
      },
      body: {
        pushToken: '333d0b3c3f3b3a330f3d0333333b33a3b0f33c33b333a333333ece3ab33333c3'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(JSON.stringify(response.body)).to.contain('Serial Number Already Registered for Device')
    })
  })

  it('success when deviceLibraryIdentifier is not already registered', () => {
    const randomDeviceLibraryIdentifier : string = 'cypress_' + crypto.randomBytes(16).toString('hex')
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/' + randomDeviceLibraryIdentifier + '/registrations/pass.org.passport.nation3/5',
      headers: {
        'Authorization': 'ApplePass 0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab'
      },
      body: {
        pushToken: '333d0b3c3f3b3a330f3d0333333b33a3b0f33c33b333a333333ece3ab33333c3'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(JSON.stringify(response.body)).to.contain('Registration Successful')
    })
  })
})

export {}
