const express = require('express');
const router = express.Router();


const PedidosController = require('../controllers/pedidos-controller');
// retorna todos os pedidos
router.get('/', PedidosController.getPedidos);

// insere (posta) um novo pedido
router.post('/', PedidosController.postPedidos);



// retorna os dados de um produto
router.get('/:id_pedido',PedidosController.getUmPedido);


//deleta um pedido
router.delete('/', PedidosController.deletePedido);

module.exports = router;