describe('/api/pushUpdate', () => {

  it('error when missing username/password', () => {
    cy.request({
      url: '/api/pushUpdate',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  }),

  it('error when wrong username/password', () => {
    cy.request({
      url: '/api/pushUpdate',
      headers: {
        authorization: 'Basic ' + Buffer.from('usr123:pwd123').toString('base64')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  }),

  it('success when correct username/password', () => {
    cy.request({
      url: '/api/pushUpdate',
      headers: {
        authorization: 'Basic ' + Buffer.from('username:password').toString('base64')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(JSON.stringify(response.body)).to.contain('updateSent')
    })
  })
})

export {}
