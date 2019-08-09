const request = require('request');

const baseUrl = 'http://localhost:3000';

describe('Animal Groups', () => {
    describe('GET /animalGroups', () => {
        it('returns status code 200', (done) => {
            request.get(baseUrl + '/animalGroups', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});
