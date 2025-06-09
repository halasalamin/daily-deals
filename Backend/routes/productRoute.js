import express from 'express';
import { listProduct, addProduct, removeProduct, SingleProduct, updateProduct, productsByCompany, searchProduct, filterProducts,
     getRelatedProducts, updateMyProduct, removeProductByAdmin } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import companyAuth from '../middleware/companyAuth.js';

const productRouter = express.Router();

productRouter.post('/add', companyAuth, upload.array('photos'), addProduct);
productRouter.delete('/remove/:id', companyAuth, removeProduct); 
productRouter.delete('/remove-product/:id', adminAuth, removeProductByAdmin); 
productRouter.get('/single/:productId', SingleProduct); 
productRouter.get('/list', listProduct);
productRouter.put('/update', adminAuth, upload.array('photos'), updateProduct);
productRouter.get('/company/:companyId', productsByCompany);
productRouter.get('/search', searchProduct);
productRouter.put("/update/:id", companyAuth, updateMyProduct);
productRouter.get('/filter', filterProducts);
productRouter.get('/related/:id', getRelatedProducts)

export default productRouter;
