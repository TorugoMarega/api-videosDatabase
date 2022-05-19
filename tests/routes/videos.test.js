const videos = require('../../routes/videos');

const request = require('supertest')
//const app = require('../../app')
test('rota padrao', async () =>{
    const response  = request(videos).get("/");
    await response
})

