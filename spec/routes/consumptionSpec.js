const request = require('request');

const baseUrl = 'http://localhost:3000';

describe('Consumption', () => {
    describe('GET /consumptions', () => {
        it('returns status code 200', (done) => {
            request.get(baseUrl + '/consumptions', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});
