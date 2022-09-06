describe('Log a Message', () => {

  it('error when wrong request method (GET instead of POST)', () => {
    cy.request({
      method: 'GET',
      url: '/api/apple/v1/log',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(JSON.stringify(response.body)).to.contain('Request Not Authorized: Wrong request method')
    })
  })

  it('success when POST request', () => {
    cy.request({
      method: 'POST',
      url: '/api/apple/v1/log',
      body: {
        logs: [
          '[2022-09-06 09:14:07 +0800] Get serial #s task (for device b33e3a3dccb3030333e3333da33333a3, pass type pass.org.passport.nation3, last updated (null); with web service url https://passports.nation3.org/api/apple) encountered error: Unexpected response code 404',
          '[2022-09-06 09:14:07 +0800] Get serial #s task (for device b33e3a3dccb3030333e3333da33333a3, pass type pass.org.passport.nation3, last updated (null); with web service url https://passports.nation3.org/api/apple) encountered error: Unexpected response code 404'
        ]
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(JSON.stringify(response.body)).to.contain('OK')
    })
  })
})
