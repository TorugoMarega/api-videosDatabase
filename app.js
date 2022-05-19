const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const rotaVideos = require('./routes/videos')
const rotaCategorias = require('./routes/categorias')
const rotaUsuarios = require('./routes/usuarios')

app.use(cors())

app.get('/', (req, res, error) => {//RETORNA MENSAGEM DE BEM VINDO APÓS SUCESSO NA REQUISIÇÃO DO ENDPOINT PADRÃO
  return res.json([
    { mensagem: 'Bem vindo' }
  ])
})

app.use(morgan('dev'))// GERA LOG DAS REQUISIÇÕES HTTP

// app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With ,Content-Type, Accept, Aauthorization'
  )

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).send({})
  }
  next()
})

app.use('/videos', rotaVideos)
app.use('/categorias', rotaCategorias)
app.use('/usuarios', rotaUsuarios)

// Quando não encontrar rota
app.use((req, res, next) => {
  const erro = new Error('Rota não encontrada')
  erro.status = 404
  next(erro)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  return res.send({
    erro: {
      mensagem: error.message
    }
  })
})

module.exports = app
