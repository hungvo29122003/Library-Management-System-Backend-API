const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bookController = require('../controllers/bookController');

// Cấu hình multer để lưu file hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}


router.get('/', bookController.getAllBooks);
router.get('/tenSach', bookController.getAllNameBooks)
router.post('/', upload.single('image'), bookController.addBook);
router.get('/name', bookController.findBookByName)
router.delete('/delete/:tenSach', bookController.deleteBook);
module.exports = router;