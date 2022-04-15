const express = require('express');
const app = express();
const morgan = require ('morgan');
const bodyParser = require('body-parser');

const rotaVideos = require('./routes/videos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With ,Content-Type, Accept, Aauthorization'
        );

        if (req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).send({});
        }
        next();
})

app.use('/videos', rotaVideos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios)

//Quando não encontrar rota
app.use((req, res, next) => {
    const erro = new Error ('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro:{ 
           mensagem: error.message
        }
    })
});


module.exports = app;