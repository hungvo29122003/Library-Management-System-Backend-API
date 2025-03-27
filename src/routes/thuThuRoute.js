const express = require('express')
const router = express.Router()
const thuThuController = require('../controllers/thuThuController')

router.get('/', thuThuController.getThuThu)
router.get('/thongTin/:id', thuThuController.getInfomationThuThu)
router.put('/thongTin/:id', thuThuController.updateThuThu)
router.get("/tai-khoan/:maTaiKhoan", thuThuController.getThuThuByTaiKhoan);


module.exports = router