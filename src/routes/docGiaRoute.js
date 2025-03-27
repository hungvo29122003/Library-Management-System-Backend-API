const express = require('express')
const router = express.Router();
const docGiaController = require('../controllers/docGiaController')


router.get('/', docGiaController.getAllDocGia)
router.get('/tenDocGia', docGiaController.getAllNameDocGia)
router.get('/maDocGia', docGiaController.getMaDocGia)
router.get('/:id', docGiaController.getLockStatus)
router.put('/lock', docGiaController.updateLockStatus)
router.get('/thongTin/:id', docGiaController.getInfomationDocGia)
router.put('/thongTin/:id', docGiaController.updateReader)
module.exports = router