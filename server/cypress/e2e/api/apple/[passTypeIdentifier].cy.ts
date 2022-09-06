describe('Get the List of Updatable Passes', () => {

  it('error when wrong request method (POST instead of GET)', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Wrong request method')
    })
  })

  it('error when missing passesUpdatedSince parameter', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Missing/empty parameter: passesUpdatedSince')
    })
  })

  it('204 when unknown deviceLibraryIdentifier', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/b00e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3?passesUpdatedSince={previousLastUpdated}',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(204)
    })
  })

  it('200 when existing deviceLibraryIdentifier', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3?passesUpdatedSince={previousLastUpdated}',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(JSON.stringify(response.body)).to.contain('serialNumbers')
      expect(JSON.stringify(response.body)).to.contain('lastUpdated')
      // TODO: verify serial number values
    })
  })
})

export {}