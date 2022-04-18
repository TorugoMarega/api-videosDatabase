const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const CategoriasController = require('../controllers/categorias-controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg'|| file.mimetype ==='image/png'){
        cb(null,true);
    } else {
        cb(null,false);
    }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//retorna os videos de uma categoria específica
router.get('/:id/videos', CategoriasController.getVideosPorCategoria);


// retorna todas as categorias
router.get('/', CategoriasController.getCategorias);

// insere (posta) uma nova categoria
//router.post('/',login.obrigatorio, upload.single('produto_imagem'), VideosController.postProdutos);
router.post('/', CategoriasController.postCategorias);

// retorna os dados de uma categoria
router.get('/:id',CategoriasController.getUmaCategoria);

//altera um categoria
/* router.patch('/',login.obrigatorio, VideosController.patchProduto); */
router.patch('/', CategoriasController.patchCategorias);

//deleta uma categoria
/* router.delete('/',login.obrigatorio, VideosController.deleteProduto);
 */
router.delete('/', CategoriasController.deleteCategorias);



module.exports = router;