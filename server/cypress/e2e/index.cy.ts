describe('/', () => {

  it('success when loading index page', () => {
    cy.request({
      url: '/',
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('NEXT_PUBLIC_CHAIN: goerli')
    })
  })
})

export {}
