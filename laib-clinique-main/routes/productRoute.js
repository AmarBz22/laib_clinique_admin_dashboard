const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/product'); // Adjust the path as needed
const authenticateToken = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload'); // Import Multer config

// Route to create a new product with image upload
router.post('/create', upload.single('photo'), createProduct);
router.get('/get',getProducts);
router.get('/:id', getProductById);
router.put('/:id', upload.single('photo'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
