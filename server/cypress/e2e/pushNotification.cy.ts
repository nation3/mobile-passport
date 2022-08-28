describe('/api/pushNotification', () => {

  it('error when missing username/password', () => {
    cy.request({
      url: '/api/pushNotification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})

export {}
