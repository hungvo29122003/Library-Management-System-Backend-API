const PhieuMuonModel = require('../models/loanSlipModel');
const docGiaModel = require('../models/docGiaModel');
const pool = require('../utils/connectDB');

class phieuMuonController {
    // async createPhieuMuon(req, res) {
    //     try {
    //         const { maThuThu, maDocGia, ngayMuon, danhSachSach } = req.body;
    
    //         console.log("📌 Dữ liệu nhận được:", req.body);

    //         const lockStatus = await docGiaModel.getLockStatus(maDocGia);
    //         console.log(lockStatus)
    //         if (!lockStatus) {
    //             return res.status(404).json({ message: "Không tìm thấy độc giả!" });
    //         }
    //         if (lockStatus.lockAccount) {
    //             return res.status(403).json({ message: "Độc giả đang bị khoá, không thể mượn sách!" });
    //         }
    //         console.log(lockStatus.lockAccount)
    
    //         // Thêm phiếu mượn
    //         await PhieuMuonModel.addPhieuMuon(maThuThu, maDocGia, ngayMuon);
    
    //         // Lấy maPhieuMuon mới nhất
    //         const maPhieuMuon = await PhieuMuonModel.getLastPhieuMuonId();
    //         console.log("📌 maPhieuMuon:", maPhieuMuon);
    
    //         // Kiểm tra danh sách sách trước khi thêm
    //         console.log("📌 Danh sách sách:", danhSachSach);
    
    //         // Thêm danh sách sách vào ChiTietPhieuMuon
    //         await PhieuMuonModel.addChiTietPhieuMuon(maPhieuMuon, danhSachSach);
    
    //         res.json({ message: "Tạo phiếu mượn thành công!", maPhieuMuon });
    
    //     } catch (error) {
    //         console.error("❌ Lỗi tạo phiếu mượn:", error);
    //         res.status(500).json({ message: "Lỗi server!", error });
    //     }
    // };
    async createPhieuMuon(req, res) {
        try {
            const { maThuThu, maDocGia, ngayMuon, danhSachSach } = req.body;
    
            console.log("📌 Dữ liệu nhận được:", req.body);
    
            // Kiểm tra trạng thái khóa của độc giả
            const lockStatus = await docGiaModel.getLockStatus(maDocGia);
            if (!lockStatus) {
                return res.status(404).json({ message: "Không tìm thấy độc giả!" });
            }
            if (lockStatus.lockAccount) {
                return res.status(403).json({ message: "Độc giả đang bị khoá, không thể mượn sách!" });
            }
    
            // Kiểm tra dữ liệu đầu vào
            if (!maThuThu || !maDocGia || !danhSachSach || danhSachSach.length === 0) {
                return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
            }
    
            // Kiểm tra danh sách sách hợp lệ
            const maSachList = danhSachSach
                .map(sach => sach.maSach)
                .filter(maSach => maSach !== undefined);
    
            if (maSachList.length === 0) {
                return res.status(400).json({ message: "Danh sách sách không hợp lệ!" });
            }
    
            console.log("📌 maSachList:", maSachList);
    
            // Truy vấn danh sách sách có trong kho
            const placeholders = maSachList.map(() => "?").join(",");
            const [existingSach] = await pool.execute(
                `SELECT maSach, soLuong FROM Sach WHERE maSach IN (${placeholders})`,
                maSachList
            );
    
            console.log("📌 existingSach:", existingSach);
    
            if (existingSach.length === 0) {
                return res.status(400).json({ message: "Tất cả mã sách đều không tồn tại trong kho!" });
            }
    
            const existingMaSach = existingSach.map(row => row.maSach);
            const invalidMaSach = maSachList.filter(maSach => !existingMaSach.includes(maSach));
    
            if (invalidMaSach.length > 0) {
                return res.status(400).json({
                    message: `Các mã sách không tồn tại: ${invalidMaSach.join(", ")}`
                });
            }
    
            // Kiểm tra số lượng sách có đủ để mượn không
            for (let sach of danhSachSach) {
                const sachInDB = existingSach.find(s => s.maSach === sach.maSach);
                if (!sachInDB) {
                    return res.status(400).json({ message: `Sách ${sach.maSach} không tồn tại!` });
                }
                if (sachInDB.soLuong < (sach.soLuong || 1)) {
                    return res.status(400).json({
                        message: `Sách ${sach.maSach} không đủ số lượng để mượn! Số lượng hiện có: ${sachInDB.soLuong}`
                    });
                }
            }
    
            // Thêm phiếu mượn
            await PhieuMuonModel.addPhieuMuon(maThuThu, maDocGia, ngayMuon);
    
            // Lấy maPhieuMuon mới nhất
            const maPhieuMuon = await PhieuMuonModel.getLastPhieuMuonId();
            console.log("📌 maPhieuMuon:", maPhieuMuon);
    
            // Thêm danh sách sách vào ChiTietPhieuMuon
            await PhieuMuonModel.addChiTietPhieuMuon(maPhieuMuon, danhSachSach);
    
            // Giảm số lượng sách trong kho
            for (let sach of danhSachSach) {
                await PhieuMuonModel.giamSoLuongSach(sach.maSach, sach.soLuong || 1);
            }
    
            res.json({ message: "Tạo phiếu mượn thành công!", maPhieuMuon });
        } catch (error) {
            console.error("❌ Lỗi tạo phiếu mượn:", error);
            res.status(500).json({ message: "Lỗi server!", error });
        }
    }
    
    
    async getAllPhieuMuon(req, res) {
        try {
            const phieuMuon = await PhieuMuonModel.getAllLoanSlips();
            res.status(200).json(phieuMuon);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    // async getPhieuMuon(req, res) {
    //     try {
    //         const phieuMuon = await PhieuMuonModel.getAllLoanSlips();
    //         res.status(200).json(phieuMuon);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Lỗi server!', error });
    //     }
    // }
    async getPhieuMuonById(req, res) {
        try {
            const { id } = req.params;
            const phieuMuon = await PhieuMuonModel.getLoanSlipById(id);
            res.status(200).json(phieuMuon);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getChiTietPhieuMuon(req, res) {
        try {
            const { id } = req.params;
            console.log("📌 ID phiếu mượn:", id);
            const chiTietPhieuMuon = await PhieuMuonModel.getChiTietPhieuMuon(id);
            res.status(200).json(chiTietPhieuMuon);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}
module.exports = new phieuMuonController;