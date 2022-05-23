const jwt = require('jsonwebtoken')

exports.obrigatorio = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    //console.log("\nreq header auth: " +req.headers.authorization+"\n")
    //console.log("token: " +token)
    const decode = jwt.verify(token, process.env.JWT_KEY)
    req.usuario = decode
    next()
  } catch (error) {
    return res.status(401).send({ mensagem: 'Usuário não autenticado' })
  }
}






















/* exports.opcional = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY)
    req.usuario = decode
    next()
  } catch (error) {
    next()
  }
}
 */