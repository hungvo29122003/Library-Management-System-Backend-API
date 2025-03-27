const express = require("express");
const router = express.Router();
const phieuMuonController = require("../controllers/phieuMuonController");

// Endpoint tạo phiếu mượn
router.get("/", phieuMuonController.getAllPhieuMuon);
router.post("/", phieuMuonController.createPhieuMuon);
router.get('/chiTietPhieuMuon/:id', phieuMuonController.getChiTietPhieuMuon);
module.exports = router;