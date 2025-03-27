const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAllCategory)
router.post('/', categoryController.addCategory)
router.delete('/:id', categoryController.deleteCategory)
module.exports = router;