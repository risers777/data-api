const request = require('supertest');
const { app, sequelize } = require('./app');


describe('GET /data', async () => {
  beforeAll(async () =>{
    await sequelize.authenticate();
    await sequelize.sync({ alter: true});
  })

  it('response with json with key', async (done) =>{
    request(app)
    .get('/data?key=12345')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200,done)
    .end((err, resp) =>{
      if(err) return done(err);
      expect(res.text).toEqual('[]');
      return done();
    })
  });

  it('response with 403 without key', async (done) =>{
    request(app)
    .get('/data?key=12356')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(403)
    .end((err, resp) =>{
      if(err) return done(err);
      expect(res.text).toEqual('Bad API key');
      return done();
    })
  });

  it('response with 403 with a bad API key', async (done) =>{
    request(app)
    .get('/data')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(403)
    .end((err, resp) =>{
      if(err) return done(err);
      expect(res.text).toEqual('Bad API key');
      return done();
    })
  });

});
