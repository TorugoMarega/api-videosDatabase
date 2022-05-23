const express = require('express')
const router = express.Router()

const login = require('../middleware/login')

const CategoriasController = require('../controllers/categorias-controller')

// retorna os videos de uma categoria específica
router.get('/:id/videos',login.obrigatorio,CategoriasController.getVideosPorCategoria)

// retorna todas as categorias
router.get('/',login.obrigatorio,CategoriasController.getCategorias)

// insere (posta) uma nova categoria
router.post('/', CategoriasController.postCategorias)

// retorna os dados de uma categoria
router.get('/:id', CategoriasController.getUmaCategoria)


// altera um categoria
router.patch('/', CategoriasController.patchCategorias)

// deleta uma categoria
router.delete('/', CategoriasController.deleteCategorias)

module.exports = router











//const multer = require('multer')
/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const data = new Date().toISOString().replace(/:/g, '-') + '-'
    cb(null, data + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})
 */