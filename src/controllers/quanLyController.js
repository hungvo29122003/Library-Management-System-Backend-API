const quanLyModel = require('../models/quanLyModel')

class quanLyController {
    async getQuanLy(req, res) {
        try {
            const quanLy = await quanLyModel.getQuanLy()
            console.log(quanLy)
            return res.status(201).json(quanLy)
        }
        catch (err) {
            return res.status(500).json({ message: err.message })
        }
    };
    async getInfomationQuanLy1(req, res) {
        try {
            const { id } = req.params;
            console.log("📌 ID Quản Lý:", id);
    
            // Gọi model để lấy thông tin quản lý
            const infomation = await quanLyModel.getInfomationManager(id);
    
            if (!infomation) {
                return res.status(404).json({ message: "Không tìm thấy quản lý" });
            }
    
            console.log("📌 Thông tin Quản Lý:", infomation);
            return res.status(200).json(infomation);
    
        } catch (error) {
            console.error("❌ Lỗi khi lấy thông tin Quản Lý:", error);
            return res.status(500).json({ message: "Lỗi server khi lấy thông tin Quản Lý!" });
        }
    };
    async updateManager(req, res) {
        try {
            console.log("📌 Body nhận được:", req.body); // Debug
    
            const { id } = req.params;
            const { tenQuanLy, cccd, diaChi, namSinh, sdt, avatar } = req.body;
            console.log(id, tenQuanLy, cccd, diaChi, namSinh, sdt, avatar);
            if (!id) {
                return res.status(400).json({ message: "Thiếu mã quản lý!" });
            }
    
            // Gọi model để cập nhật thông tin
            const success = await quanLyModel.updateManagerInfo(
                id, tenQuanLy, cccd, diaChi, namSinh, sdt, avatar
            );
    
            if (success) {
                return res.status(200).json({ message: "Cập nhật thông tin quản lý thành công!" });
            }
    
            return res.status(404).json({ message: "Không tìm thấy quản lý!" });
        } catch (error) {
            console.error("❌ Lỗi cập nhật quản lý:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    };
    async getQuanLyByTaiKhoan(req, res){
        try {
            const { maTaiKhoan } = req.params;
            console.log(maTaiKhoan)
            if (!maTaiKhoan) {
                return res.status(400).json({ message: "Thiếu mã tài khoản!" });
            }
    
            const quanLy = await quanLyModel.getQuanLyByTaiKhoan(maTaiKhoan);
            if (!quanLy) {
                return res.status(404).json({ message: "Không tìm thấy quản lý!" });
            }
    
            return res.status(200).json({ maQuanLy: quanLy.maQuanLy });
        } catch (error) {
            console.error("❌ Lỗi tìm kiếm quản lý:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    };
    async updateQuanLy(req, res) {
        try {
            console.log("📌 Body nhận được:", req.body); // Debug

            const { id } = req.params;
            let { tenQuanLy, cccd, diaChi, namSinh, sdt, avatar = null } = req.body;
            console.log(id, tenQuanLy, cccd, diaChi, namSinh, sdt, avatar);

            if (!id) {
                return res.status(400).json({ message: "Thiếu mã quản lý!" });
            }
            if (!tenQuanLy || !cccd || !diaChi || !namSinh || !sdt) {
                return res.status(400).json({ message: "Thiếu thông tin cập nhật!" });
            }
            const success = await quanLyModel.updateQuanLyInfo(
                id, tenQuanLy, cccd, diaChi, namSinh, sdt, avatar
            );

            if (success) {
                return res.status(200).json({ message: "Cập nhật thông tin quản lý thành công!" });
            }

            return res.status(404).json({ message: "Không tìm thấy quản lý!" });
        } catch (error) {
            console.error("❌ Lỗi cập nhật thủ thư:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    };
    async getInfomationQuanLy(req, res) {
        try {
            const { id } = req.params;
            console.log("📌 ID Quản lý:", id);

            const infomation = await quanLyModel.getInfomationQuanLy(id);

            if (!infomation) {
                return res.status(404).json({ message: "Không tìm thấy quản lý" });
            }

            console.log("📌 Thông tin quản lý:", infomation);
            return res.status(200).json(infomation);
        } catch (error) {
            console.error("❌ Lỗi khi lấy thông tin quản lý:", error);
            return res.status(500).json({ message: "Lỗi server khi lấy thông tin quản lý!" });
        }
    }
}

module.exports = new quanLyController