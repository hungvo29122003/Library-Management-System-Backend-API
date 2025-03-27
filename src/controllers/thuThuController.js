const thuThuModel = require("../models/thuThuModel");

class ThuThuController {
    // 🟢 Lấy danh sách tất cả thủ thư
    async getThuThu(req, res) {
        try {
            const thuThu = await thuThuModel.getThuThu();
            console.log("📌 Danh sách Thủ Thư:", thuThu);
            return res.status(200).json(thuThu);
        } catch (err) {
            console.error("❌ Lỗi lấy danh sách thủ thư:", err);
            return res.status(500).json({ message: "Lỗi server khi lấy danh sách thủ thư!" });
        }
    }

    // 🟢 Lấy thông tin chi tiết một thủ thư
    async getInfomationThuThu(req, res) {
        try {
            const { id } = req.params;
            console.log("📌 ID Thủ Thư:", id);

            const infomation = await thuThuModel.getInfomationThuThu(id);

            if (!infomation) {
                return res.status(404).json({ message: "Không tìm thấy thủ thư" });
            }

            console.log("📌 Thông tin Thủ Thư:", infomation);
            return res.status(200).json(infomation);
        } catch (error) {
            console.error("❌ Lỗi khi lấy thông tin Thủ Thư:", error);
            return res.status(500).json({ message: "Lỗi server khi lấy thông tin Thủ Thư!" });
        }
    }

    // 🟢 Cập nhật thông tin thủ thư
    async updateThuThu(req, res) {
        try {
            console.log("📌 Body nhận được:", req.body); // Debug

            const { id } = req.params;
            let { tenThuThu, cccd, diaChi, namSinh, sdt, avatar = null } = req.body;
            console.log(id, tenThuThu, cccd, diaChi, namSinh, sdt, avatar);

            if (!id) {
                return res.status(400).json({ message: "Thiếu mã thủ thư!" });
            }
            if (!tenThuThu || !cccd || !diaChi || !namSinh || !sdt) {
                return res.status(400).json({ message: "Thiếu thông tin cập nhật!" });
            }
            const success = await thuThuModel.updateThuThuInfo(
                id, tenThuThu, cccd, diaChi, namSinh, sdt, avatar
            );

            if (success) {
                return res.status(200).json({ message: "Cập nhật thông tin thủ thư thành công!" });
            }

            return res.status(404).json({ message: "Không tìm thấy thủ thư!" });
        } catch (error) {
            console.error("❌ Lỗi cập nhật thủ thư:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    }
    async getThuThuByTaiKhoan(req, res){
        try {
            const { maTaiKhoan } = req.params;
            if (!maTaiKhoan) {
                return res.status(400).json({ message: "Thiếu mã tài khoản!" });
            }
    
            const thuThu = await thuThuModel.getThuThuByTaiKhoan(maTaiKhoan);
            if (!thuThu) {
                return res.status(404).json({ message: "Không tìm thấy thủ thư!" });
            }
    
            return res.status(200).json({ maThuThu: thuThu.maThuThu });
        } catch (error) {
            console.error("❌ Lỗi tìm kiếm thủ thư:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    }
}

module.exports = new ThuThuController();
