const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const VideosController = require('../controllers/videos-controller');

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



// retorna todos os videos
router.get('/', VideosController.getVideos);

// insere (posta) um novo video
//router.post('/',login.obrigatorio, upload.single('produto_imagem'), VideosController.postProdutos);
router.post('/', VideosController.postVideos);

//retorna os videos pelo título
router.get('/search/',VideosController.getVideosPorTitulo);

// retorna os dados de um video
router.get('/:id',VideosController.getUmVideo);

//altera um video
/* router.patch('/',login.obrigatorio, VideosController.patchProduto); */
router.patch('/', VideosController.patchVideos);

//deleta um video
/* router.delete('/',login.obrigatorio, VideosController.deleteProduto);
 */router.delete('/', VideosController.deleteVideos);




module.exports = router;