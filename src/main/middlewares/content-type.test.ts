import request from 'supertest'
import app from '../config/app'

describe('Content type middleware', () => {
  it('Should return default content type as JSON', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app).get('/test_content_type').expect('content-type', /json/)
  })
})

describe('Content type middleware', () => {
  it('Should return XML type on header when forced', async () => {
    app.get('/test_allow_xml_type', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app).get('/test_allow_xml_type').expect('content-type', /xml/)
  })
})
