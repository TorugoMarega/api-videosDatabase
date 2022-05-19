const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.cadastrarUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: 'Error' }) }
    conn.query(
      'SELECT * FROM usuarios WHERE email = ?', [req.body.email],
      (error, results) => {
        if (error) { return res.status(500).send({ error }) }
        if (results.length > 0) {
          return res.status(409).send({ mensagem: 'Usuário já cadastrado' })
        } else {
          // CRIPTOGRAFA A SENHA ANTES DE SALVAR NO BANCO DE DADOS
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt })
            }
            //INSERE OS DADOS DO USUÁRIO E O RESULTADO DA CRIPTOGRAFIA DA SENHA
            conn.query('INSERT INTO usuarios (email, senha) VALUES(?, ?)',
              [req.body.email, hash],
              (error, results) => {
                conn.release()
                if (error) { return res.status(500).send({ error }) }
                const response = {
                  mensagem: 'Usuário criado com sucesso',
                  usuarioCriado: {
                    id_usuario: results.insertId,
                    email: req.body.email
                  }
                }
                return res.status(201).send(response)
              })
          })
        }
      })
  })
}

exports.Login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error }) }
    const query = 'SELECT * FROM usuarios WHERE email = ?'
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release()
      if (error) { return res.status(500).send({ error }) }
      if (results.length < 1) {
        return res.status(404).send({ mensagem: 'Usuário e/ou senha incorretos' })
      }
      //COMPARA O HASH DA SENHA PASSADA NA REQUISIÇÃO COM O HASH SALVO NO BANCO DE DADOS
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          return res.status(401).send({ mensagem: 'Falha na autenticação' })
        }
        if (result) {
          const token = jwt.sign({ // cria o token
            id_usuario: results[0].id_usuario,
            email: results[0].email
          }, process.env.JWT_KEY, // variavel de ambiente
          {
            expiresIn: '1h'// token expira em 1h obrigando a fazer o login novamente
          })
          return res.status(200).send({
            mensagem: 'Autenticado com sucesso',
            token
          })
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
      })
    })
  })
}
