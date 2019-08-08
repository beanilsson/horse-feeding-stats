const request = require('request');

const baseUrl = 'http://localhost:3000';

describe('Server is alive', () => {
    describe('GET /', () => {
        it('returns status code 200', (done) => {
            request.get(baseUrl + '/', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});
