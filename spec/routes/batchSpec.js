const request = require('request');

const baseUrl = 'http://localhost:3000';

describe('Batch', () => {
    describe('GET /batches', () => {
        it('returns status code 200', (done) => {
            request.get(baseUrl + '/batches', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});
