describe('Register a Pass for Update Notifications', () => {

  it('error when wrong request method (GET instead of POST)', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Wrong request method')
    })
  })

  it('error when authentication token missing in header', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Missing/empty header: authorization')
    })
  })

  // it('error when invalid authentication token in header', () => {
  //   cy.request({
  //     method: 'POST',
  //     url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333',
  //     headers: {
  //       'Authorization': 'ApplePass 0x123'
  //     },
  //     failOnStatusCode: false
  //   }).then((response) => {
  //     expect(response.status).to.eq(401)
  //     expect(JSON.stringify(response.body)).to.contain('Invalid header: authorization')
  //   })
  // })

  it('error when push token missing in body', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333',
      headers: {
        'Authorization': 'ApplePass 0x3fbeb3ae33af3fb33f3d33333303d333a333aff33f3133efbc3330333adb333a'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Missing/empty body: pushToken')
    })
  })

  it('error when deviceLibraryIdentifier is already registered', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3/333',
      headers: {
        'Authorization': 'ApplePass 0x3fbeb3ae33af3fb33f3d33333303d333a333aff33f3133efbc3330333adb333a'
      },
      body: {
        pushToken: '333d0b3c3f3b3a330f3d0333333b33a3b0f33c33b333a333333ece3ab33333c3'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('duplicate key value violates unique constraint')
    })
  })

  // TODO: test success (HTTP 201)
})

export {}
