const request = require('supertest');

const server = 'http://localhost:3000';

describe('localhost:3000', () => {
  it('responds with 200 status and text/html content type', () => {
    return request(server)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200);
  });

  it('responds with 404 status if unknown route', () => {
    return request(server)
      .get('/foo')
      .expect(404);
  });
});

describe('/api/newLocation', () => {
  const newLocation = {
    name: 'Codesmith',
    caption: 'Integration testing is fun!',
    street_address: '1600 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90291',
    public: true,
    created_by_id: 45,
    category: 4
  };

  it('responds with list of locations + new location', () => {
    return request(server)
      .post('/api/newLocation')
      .send(newLocation)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
});

describe('/api/getList', () => {
  it('responds with list of locations', () => {
    return request(server)
      .get('/api/getList')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
});

describe('/api/getPersonalList/:user', () => {
  it('responds with list of locations created by user', () => { 
    return request(server)
      .get('/api/getPersonalList/testing555')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
      })
  });
});


