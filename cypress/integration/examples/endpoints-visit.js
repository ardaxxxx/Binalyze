/// <reference types="Cypress" />

describe('Visit page API Test Cases', () => {

    it('GET - The endpoint associated with the provided id does not exist in the database.', () =>{
        cy.fixture('example').then(data => {
            cy.request({
                method: 'GET',
                url: `api/endpoints/visit/${data.endpointParam3._id}/${data.endpointParam3.version}`,
            }).its('body.0').then((response) => {
                expect(response).property('type').equal(data.types.uninstall)
                })
            })
    })

    it('GET - The endpoint associated with the provided id exist in the database and version is less than the latest version', () =>{
        cy.fixture('example').then(data => {
            cy.request({
                method: 'GET',
                url: `api/endpoints/visit/${data.endpointParam1._id}/${data.endpointParam1.version}`,
            }).its('body.0').then((response) => {
                expect(response).property('type').equal(data.types.update)
                })
            })
    })

    it('GET - The endpoint associated with the provided id exist in the database and version is less than the latest version and endpoint has one or more assigned tasks', () =>{
        cy.fixture('example').then(data => {
            cy.request({
                method: 'POST',
                url: 'api/tasks',
                body: data.assingTaskUpdate
                }).then((response) => {
                    expect(response.status).equal(201)
                    expect(response.body).to.have.length(2)
                    cy.request({
                        method: 'GET',
                        url: `api/endpoints/visit/${data.endpointParam1._id}/${data.endpointParam1.version}`,
                        }).its('body.0').then((response) => {
                            expect(response).property('type').equal(data.types.update)
                        })
                    }) 
        })
    })

    it('GET - The endpoint associated with the provided id exist in the database and version is less than the latest version and endpoint has one or more assigned tasks', () =>{
        cy.fixture('example').then(data => {
            cy.request({
                method: 'POST',
                url: 'api/tasks',
                body: data.assingTaskShutdown
                }).then((response) => {
                    expect(response.status).equal(201)
                    expect(response.body).to.have.length(2)
                    cy.request({
                        method: 'GET',
                        url: `api/endpoints/visit/${data.endpointParam1._id}/${data.latestVersion.version}`,
                        }).its('body.0').then((response) => {
                            expect(response).property('type').equal(data.types.shutdown)
                        })
                    })
        }) 
    })

    it('GET - The endpoint associated with the provided id exist in the database and version is equal latest version and there is no assigned task', () =>{
        cy.fixture('example').then(data => {
            cy.request({
                method: 'GET',
                url: `api/endpoints/visit/${data.endpointParam1._id}/${data.latestVersion.version}`,
                }).then((response) => {
                    expect(response.status).equal(200)
                    expect(response.body).to.have.length(0)
                })
        }) 
    })

})
