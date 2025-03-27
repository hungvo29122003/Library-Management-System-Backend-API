const phieuTraModel = require('../models/phieuTraModel');
const pool = require('../utils/connectDB')
class PhieuTraController {
    async getAllPhieuTra(req, res) {
        try {
            const phieuTra = await phieuTraModel.getPhieuTra();
            res.status(200).json(phieuTra);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    // async createPhieuTra(req, res) {
    //     try {
    //         const { maPhieuMuon, maThuThu, ngayTra, danhSachSachTra, tongTien} = req.body;
            
    //         console.log("📌 Dữ liệu nhận được:", req.body);
    
    //         // Thêm phiếu trả
    //         await phieuTraModel.addPhieuTra(maPhieuMuon, maThuThu, ngayTra, tongTien);
    
    //         // Lấy maPhieuTra mới nhất
    //         const maPhieuTra = await phieuTraModel.getLastPhieuTraId();
    //         console.log("📌 maPhieuTra:", maPhieuTra);
    
    //         // Kiểm tra danh sách sách trước khi thêm
    //         console.log("📌 Danh sách sách trả:", danhSachSachTra);
    
    //         // Thêm chi tiết phiếu trả
    //         await phieuTraModel.addChiTietPhieuTra(maPhieuTra, danhSachSachTra);
    
    //         res.json({ message: "Tạo phiếu trả thành công!", maPhieuTra });
    
    //     } catch (error) {
    //         console.error("❌ Lỗi tạo phiếu trả:", error);
    //         res.status(500).json({ message: "Lỗi server!" + error });
    //     }
    // }
    async createPhieuTra(req, res) {
        try {
            const { maPhieuMuon, maThuThu, ngayTra, danhSachSachTra, tongTien } = req.body;
    
            console.log("\ud83d\udccc Dữ liệu nhận được:", req.body);
    
            // Kiểm tra dữ liệu đầu vào
            if (!maPhieuMuon || !maThuThu || !danhSachSachTra || danhSachSachTra.length === 0 || !tongTien) {
                return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
            }
    
            // Kiểm tra xem tất cả maSach trong danhSachSachTra có tồn tại trong bảng Sach không
            const maSachList = danhSachSachTra.map(sach => sach.maSach);
            console.log("\ud83d\udccc Danh sách mã sách từ request:", maSachList);
    
            // Truy vấn kiểm tra mã sách hợp lệ
            const placeholders = maSachList.map(() => '?').join(',');
            const [existingSach] = await pool.execute(
                `SELECT maSach FROM Sach WHERE maSach IN (${placeholders})`,
                maSachList
            );
    
            const existingMaSach = existingSach.map(row => row.maSach);
            console.log("\ud83d\udccc Các mã sách hợp lệ:", existingMaSach);
    
            const invalidMaSach = maSachList.filter(maSach => !existingMaSach.includes(maSach));
            if (invalidMaSach.length > 0) {
                return res.status(400).json({
                    message: `Các mã sách không tồn tại: ${invalidMaSach.join(', ')}`
                });
            }
    
            // Nếu không có ngayTra, sử dụng ngày hiện tại
            const ngayTraDate = ngayTra ? new Date(ngayTra) : new Date();
    
            // Thêm phiếu trả
            await phieuTraModel.addPhieuTra(maPhieuMuon, maThuThu, ngayTraDate, tongTien);
    
            // Lấy maPhieuTra mới nhất
            const maPhieuTra = await phieuTraModel.getLastPhieuTraId();
            console.log("\ud83d\udccc maPhieuTra:", maPhieuTra);
    
            // Kiểm tra danh sách sách trước khi thêm
            console.log("\ud83d\udccc Danh sách sách trả:", danhSachSachTra);
    
            // Thêm chi tiết phiếu trả
            await phieuTraModel.addChiTietPhieuTra(maPhieuTra, danhSachSachTra);
    
            // Tăng số lượng sách trong kho
            for (let sach of danhSachSachTra) {
                await phieuTraModel.tangSoLuongSach(sach.maSach, sach.soLuong || 1);
            }
    
            res.status(200).json({ message: "Tạo phiếu trả thành công!", maPhieuTra });
        } catch (error) {
            console.error("❌ Lỗi tạo phiếu trả:", error);
            res.status(500).json({ message: "Lỗi server: " + error.message });
        }
    };
    async getChiTietPhieuTra(req, res) {
        try {
            const { id } = req.params;
            console.log("📌 ID phiếu trả:", id);
            const phieuTra = await phieuTraModel.getChiTietPhieuTra(id);
            console.log(phieuTra)
            res.status(200).json(phieuTra);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}

module.exports = new PhieuTraController;