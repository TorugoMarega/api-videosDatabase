const express = require('express')
const router = express.Router()


const login = require('../middleware/login')

const VideosController = require('../controllers/videos-controller')


// retorna todos os videos
router.get('/',login.obrigatorio,VideosController.getVideos)

// insere (posta) um novo video
router.post('/', VideosController.postVideos)

// retorna os videos pelo título
router.get('/search/', VideosController.getVideosPorTitulo)

// retorna os videos gratuitos aleatoriamente
router.get('/free/', VideosController.getVideosFree)

// retorna os dados de um video
router.get('/:id', VideosController.getUmVideo)

// altera um video
router.patch('/', VideosController.patchVideos)

// deleta um video
 router.delete('/', VideosController.deleteVideos)

module.exports = router










// const multer = require('multer')
/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const data = new Date().toISOString().replace(/:/g, '-') + '-'
    cb(null, data + file.originalname)
  }
}) */
/* const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
} */

/* const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
}) */
