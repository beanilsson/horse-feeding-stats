const request = require('request');

const baseUrl = 'http://localhost:3000';

describe('Horse', () => {
    describe('GET /horses', () => {
        it('returns status code 200', (done) => {
            request.get(baseUrl + '/horses', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});
