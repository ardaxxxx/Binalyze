/// <reference types="Cypress" />

describe('Endpoints API Test Cases', () => {

    it('POST - Try to create new endpoint with invalid credentials 400', () => {
        cy.fixture('example').then(data => {
            cy.request({
                method: 'POST',
                url: 'api/endpoints',
                body: data.invalidParams,
                failOnStatusCode: false,
            }).its('body.message.0').should('eq', data.messages.idStringCheck)
                // .then((response) => {
                //     expect(response.status).equal(400)
                // })  
        })
    })

    it('POST - Create new endpoint with valid credentials 201', () => {
        cy.fixture('example').then(data => {
            cy.request({
                method: 'POST',
                url: 'api/endpoints',
                body: data.endpointParam3,
            }).then((response) => {
                expect(response.status).equal(201)
                expect(response.body._id).equal(data.endpointParam3._id)
                expect(response.body.name).equal(data.endpointParam3.name)
                expect(response.body.version).equal(data.endpointParam3.version)
            })
        })
    })


    // There is no false property right now in db because of that this test case should be investigate after that
    // it('POST - Try to create new endpoint when the isManaged property is false', () => {
    //     const endpointParamInDB = {
    //         "_id": "ep-0",
    //         "name": "PC-0", 
    //         "version": 1
    //     }
    //     cy.request('POST', 'api/endpoints' , endpointParamInDB).then((response) => {
    //         expect(response.status).equal(201)
    //         expect(response.body._id).equal(endpointParamInDB._id)
    //         expect(response.body.name).equal(endpointParamInDB.name)
    //         expect(response.body.version).equal(endpointParamInDB.version)
    //     })
    // })

    it('POST - Try to create endpoint which is already registered 409', () => {
        cy.fixture('example').then(data => {
            cy.request({
                method: 'POST',
                url: 'api/endpoints',
                body: data.endpointParam3,
                failOnStatusCode: false,
            })
        }).then((response) => {
            expect(response.status).equal(409)
            expect(response).property('body').to.contain({
                message: 'Endpoint is already registered',
            })
        })
    })

    it('GET - List all endpoints and validate endpoints lenght 200', () => {
        cy.request({
            method: 'GET',
            url: 'api/endpoints',
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.length(3)    
        })
    })
    
    it('GET - List an endpoint by its id 200', () => {  
        cy.fixture('example').then(data => {
            cy.request({    
                method: 'GET',
                url: `api/endpoints/${data.endpointParam1._id}`,
            }).then((response) => { 
                expect(response.status).equal(200)
                expect(response.body._id).equal(data.endpointParam1._id)
            })
        })
    })

    it('DELETE - Delete and endpoints by its id successfully 200', () => {
        cy.fixture('example').then(data => {
            cy.request({    
                method: 'DELETE',
                url: `api/endpoints/${data.endpointParam3._id}`,
            }).then((response) => { 
                expect(response.status).equal(200)
            })
        })
    })
    
    it('DELETE - Delete and endpoints by id which is not in DB anymore 404', () => {
        cy.fixture('example').then(data => {
            cy.request({
                method: 'DELETE',
                url: `api/endpoints/${data.endpointParam3._id}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).equal(404)
                expect(response).property('body').to.contain({
                    message: 'Endpoint not found',
                    })
                })
        })
    })
})
