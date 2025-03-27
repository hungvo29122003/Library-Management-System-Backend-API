const express = require('express');
const router = express.Router();
const phieuTraController = require('../controllers/phieuTraController');

router.get('/', phieuTraController.getAllPhieuTra);
router.post('/', phieuTraController.createPhieuTra);
router.get('/chiTietPhieuTra/:id', phieuTraController.getChiTietPhieuTra);
module.exports = router;