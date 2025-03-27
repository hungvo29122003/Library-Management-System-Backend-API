const express = require('express')
const router = express.Router();
const quanLyController = require('../controllers/quanLyController')

router.get('/', quanLyController.getQuanLy)
// router.get('/thongTin/:id', quanLyController.getInfomationQuanLy)
// router.put('/thongTin/:id', quanLyController.updateManager)
router.get('/thongTin/:id', quanLyController.getInfomationQuanLy)
router.get("/tai-khoan/:maTaiKhoan", quanLyController.getQuanLyByTaiKhoan);
router.put('/thongTin/:id', quanLyController.updateQuanLy)
module.exports = router