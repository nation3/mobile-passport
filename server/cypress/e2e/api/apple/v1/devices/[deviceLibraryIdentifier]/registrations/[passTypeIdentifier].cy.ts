describe('Get the List of Updatable Passes', () => {

  it('error when wrong request method (POST instead of GET)', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/devices/cypress_b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Wrong request method')
    })
  })

  it('204 when unknown deviceLibraryIdentifier', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/cypress_b00e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(204)
    })
  })

  /**
   * When the passesUpdatedSince parameter is not included, expect all serial numbers for the device to be returned.
   * 
   * To check the expected return value, run this SQL command:
   *   select serial_number from registrations where device_library_identifier = 'cypress_b33e3a3dccb3030333e3333da33333a3';
   */
  it('200 when existing deviceLibraryIdentifier', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/cypress_b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      
      // Expected format:  "serialNumbers":["333"]
      expect(JSON.stringify(response.body)).to.contain('serialNumbers')
      expect(response.body.serialNumbers.length).to.eq(1)
      expect(response.body.serialNumbers[0]).to.eq('333')
      
      // Expected format:  "lastUpdated":"1663899405"
      expect(JSON.stringify(response.body)).to.contain('lastUpdated')
      expect(response.body.lastUpdated.length).to.eq(10)
      const lastUpdated = new Date(response.body.lastUpdated)
      expect(lastUpdated.getTime() >= 1663899405*1000)  // >= 2022-09-23 02:16:45 AM
    })
  })

  /**
   * Expect HTTP 200 OK when the passesUpdatedSince value is smaller than the 
   * timestamp of the most recent update in the `latest_updates` database table.
   * 
   * Epoch timestamp 1046662413 = 2003-03-03 03:33:33 AM
   */
   it('200 when existing deviceLibraryIdentifier and passesUpdatedSince=1046662413', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/cypress_b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3?passesUpdatedSince=1046662413',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      
      // Expected format:  "serialNumbers":["333"]
      expect(JSON.stringify(response.body)).to.contain('serialNumbers')
      expect(response.body.serialNumbers.length).to.eq(1)
      expect(response.body.serialNumbers[0]).to.eq('333')
      
      // Expected format:  "lastUpdated":"1663899405"
      expect(JSON.stringify(response.body)).to.contain('lastUpdated')
      expect(response.body.lastUpdated.length).to.eq(10)
      const lastUpdated = new Date(response.body.lastUpdated)
      expect(lastUpdated.getTime() > 1046662413*1000)  // >= 2003-03-03 03:33:33 AM
    })
  })

  /**
   * Expect HTTP 204 No Content when the passesUpdatedSince value is equal to or greather than the 
   * timestamp of the most recent update in the `latest_updates` database table.
   * 
   * When the passesUpdatedSince parameter is included, it is expected that serial numbers 
   * only be returned if the passes have not already been updated.
   * 
   * Using an epoch timestamp that is far into the future will prevent this test from failing 
   * in the future once we add more rows to the `latest_updates` table.
   * 
   * Epoch timestamp 1993433613 = 2033-03-03 03:33:33 AM
   */
  it('204 when existing deviceLibraryIdentifier and passesUpdatedSince=1993433613', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/devices/cypress_b33e3a3dccb3030333e3333da33333a3/registrations/pass.org.passport.nation3?passesUpdatedSince=1993433613',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(204)
    })
  })
})

export {}
