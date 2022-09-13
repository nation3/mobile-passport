describe('/api/pushLastUpdate', () => {

  it('error when missing username/password', () => {
    cy.request({
      url: '/api/pushLasthUpdate',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  })

  it('error when wrong username and wrong password', () => {
    cy.request({
      url: '/api/pushLastUpdate',
      headers: {
        authorization: 'Basic ' + Buffer.from('usr123:pwd123').toString('base64')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  })

  it('error when wrong username and correct password', () => {
    cy.request({
      url: '/api/pushLastUpdate',
      headers: {
        authorization: 'Basic ' + Buffer.from('usr123:password').toString('base64')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  })

  it('error when correct username and wrong password', () => {
    cy.request({
      url: '/api/pushLastUpdate',
      headers: {
        authorization: 'Basic ' + Buffer.from('username:pwd123').toString('base64')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.contain('Unauthorized')
    })
  })

  // Skip this test until we can avoid triggering notification requests being sent to APNs
  // it('success when correct username and correct password', () => {
  //   cy.request({
  //     url: '/api/pushLastUpdate',
  //     headers: {
  //       authorization: 'Basic ' + Buffer.from('username:password').toString('base64')
  //     },
  //     failOnStatusCode: false
  //   }).then((response) => {
  //     expect(response.status).to.eq(200)
  //   })
  // })
})

export {}
