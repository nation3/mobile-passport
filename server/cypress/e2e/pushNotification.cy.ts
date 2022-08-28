describe('/api/pushNotification', () => {

  it('error when missing username/password', () => {
    cy.request({
      url: '/api/pushNotification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  }),

  it('error when wrong username/password', () => {
    cy.request({
      url: '/api/pushNotification',
      headers: {
        authorization: 'Basic ' + Buffer.from('usr123:pwd123').toString('base64')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  })
})

export {}
