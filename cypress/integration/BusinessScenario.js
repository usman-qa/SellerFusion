describe('Business Scenario', () => {
  //
  it('Verify API returns 200 status and all the Data', () => {
    let Available ,Transfer, Inbound, Unfulfillable, Researching, Total, Sum, CustomerDamaged, Defective=0
    cy.intercept('GET', 'https://sellerfusion-qa-test.vercel.app/api/products').as('products')
    cy.visit('/')
    cy.wait('@products')
    cy.get('@products').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200)
      expect(xhr.response.statusMessage).to.equal('OK')
      expect(xhr.response.body.data.length).be.gt(0)
      for (var index in xhr.response.body.data) {
        Available= xhr.response.body.data[index].fulfillable
        Transfer= xhr.response.body.data[index].transfer
        Inbound= xhr.response.body.data[index].inbound_receiving + xhr.response.body.data[index].inbound_shipped + xhr.response.body.data[index].inbound_working
        Unfulfillable= xhr.response.body.data[index].total_unfulfillable
        Researching= xhr.response.body.data[index].total_researching
        Sum = Available+Transfer+Inbound+Unfulfillable+Researching
        cy.log("Available + Transfer + Inbound + Unfulfillable + Researching = "+ Sum)
        CustomerDamaged= xhr.response.body.data[index].customer_damaged
        Defective= xhr.response.body.data[index].defective
        Sum = CustomerDamaged+Defective
        cy.log("Customer Damaged + Defective = " + Sum)
      }
    })
  });
  //
  it('Validate the total calculations', () => {
    let Available ,Transfer, Inbound, Unfulfillable, Researching, Total, Sum, CustomerDamaged, Defective=0
    cy.intercept('GET', 'https://sellerfusion-qa-test.vercel.app/api/products').as('products')
    cy.visit('/')
    cy.wait('@products')
    cy.get('.css-1pjtbja').each(($el, index) => {
      cy.get('.css-1pjtbja').eq(index).trigger('mouseover',{force:true})
      cy.contains('div','Available').parent().next('.css-yp9ue7').then(($div) => {
        Available = parseFloat($div.text())
        cy.contains('span','Transfer').parent().parent().next('.css-yp9ue7').then(($div) => {
          Transfer = parseFloat($div.text())
          cy.contains('span','Inbound').parent().parent().next('.css-yp9ue7').then(($div) => {
            Inbound = parseFloat($div.text())
            cy.contains('div','Unfulfillable').parent().next('.css-yp9ue7').then(($div) => {
              Unfulfillable = parseFloat($div.text())
              cy.contains('div','Researching').parent().next('.css-yp9ue7').then(($div) => {
                Researching = parseFloat($div.text())
                cy.contains('div','Total').parent().next('.css-yp9ue7').then(($div) => {
                  Total = parseFloat($div.text())
                  Sum = Available+Transfer+Inbound+Unfulfillable+Researching
                  expect(Sum).to.equal(Total)
                })
              })
            })
          })
        })
      })
      cy.contains('div','Customer Damaged').parent().next('.css-yp9ue7').then(($div) => {
        CustomerDamaged = parseFloat($div.text())
        cy.contains('div','Defective').parent().next('.css-yp9ue7').then(($div) => {
          Defective= parseFloat($div.text())
          cy.get('.css-yp9ue7').last().then(($div) => {
            Total = parseFloat($div.text())
            Sum = CustomerDamaged+Defective
            expect(Sum).to.equal(Total)
          })
        })
      })
    })
  });
})
