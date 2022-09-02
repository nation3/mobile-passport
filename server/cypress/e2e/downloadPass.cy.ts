describe('/api/downloadPass', () => {

  it('error when missing address', () => {
    cy.request({
      url: '/api/downloadPass?address=',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Invalid address')
    })
  }),

  it('error when invalid address', () => {
    cy.request({
      url: '/api/downloadPass?address=0x123',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Invalid address')
    })
  }),

  it('error when missing signature', () => {
    cy.request({
      url: '/api/downloadPass?address=0x394b00B5De4E6f30292aCaC37f810Dd0672E211E&signature=',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Invalid signature')
    })
  }),

  it('error when invalid signature', () => {
    cy.request({
      url: '/api/downloadPass?address=0x394b00B5De4E6f30292aCaC37f810Dd0672E211E&signature=0x123',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(JSON.stringify(response.body)).to.contain('Invalid signature')
    })
  }),

  it('success when valid address and signature', () => {
    cy.request({
      url: '/api/downloadPass?address=0x394b00B5De4E6f30292aCaC37f810Dd0672E211E&signature=0xeec065511291b0f3294a8f20a67bffd1a9ad11f0d44d68e8a324c91402ed0dd26fd27400af82325ec82d6fe5cdc0b167f1be0e18dd22d0e4865015608c050d7e1c',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      // expect(JSON.stringify(response.body)).to.contain('Invalid signature')
    })
  })
})

export {}
