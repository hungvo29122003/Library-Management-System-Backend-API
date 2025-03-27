const docGiaModel = require ('../models/docGiaModel');

class DocGiaController {
    async getAllDocGia(req, res){
        try{
            const docGia = await docGiaModel.getAllDocGia()
            console.log(docGia)
            return res.status(201).json(docGia)
        } catch(error){
            return res.status(500).json({message: "Lỗi server ", error})
        }
    };
    async getAllNameDocGia(req, res){
        try{
            const docGia = await docGiaModel.getAllNameDocGia()
            console.log(docGia)
            return res.status(201).json(docGia)
        }catch(error){
            return res.status(500).json({message: "Lỗi server", error})
        }
    }
    async getMaDocGia(req, res){
        try{
            const tenDocGia = req.query.tenDocGia
            console.log(tenDocGia)
            if(!tenDocGia){
                return res.status(404).json({message: "Không tìm thấy độc giả"})
            }
            const docGia = await docGiaModel.getMaDocGia(tenDocGia)
            console.log(docGia)
            res.status(200).json({
                maDocGia: docGia.maDocGia,
                tenDocGia: docGia.tenDocGia
            });

        }catch(error){
            return res.status(500).json({message: "Lỗi server", error})
        }
    }
    async getLockStatus(req, res) {
        try {
            const { id } = req.params;
            console.log(id)
            const lockStatus = await docGiaModel.getLockStatus(id);
            if (!lockStatus) {
                return res.status(404).json({ message: "Không tìm thấy độc giả" });
            }
            console.log(lockStatus)
            return res.status(200).json(lockStatus);
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    };
    // async updateLockStatus(req, res) {
    //     try {
    //         const { id } = req.params;
    //         console.log(id)
    //         const { lockAccount } = req.body;
    //         console.log(lockAccount)
    
    //         const updated = await docGiaModel.updateLockStatus(id, lockAccount);
    //         if (!updated) {
    //             return res.status(404).json({ message: "Không tìm thấy độc giả" });
    //         }
    //         console.log(updated)
    //         res.status(200).json({ message: "Cập nhật trạng thái thành công" });
    //     } catch (error) {
    //         res.status(500).json({ message: "Lỗi server!", error });
    //     }
    // };
    async updateLockStatus(req, res) {
        try {
            const { tenDangNhap, lockAccount } = req.body;
            if (!tenDangNhap || lockAccount === undefined) {
                return res.status(400).json({ message: "Thiếu thông tin!" });
            }
    
            const success = await docGiaModel.updateLockStatus (tenDangNhap, lockAccount);
            if (success) {
                return res.status(200).json({ message: "Cập nhật trạng thái tài khoản thành công!" });
            }
    
            return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
        } catch (error) {
            console.error("❌ Lỗi cập nhật trạng thái:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    }
    async getInfomationDocGia(req, res) {
        try {
            const { id } = req.params;
            console.log("📌 ID độc giả:", id);
    
            const infomation = await docGiaModel.getInfomationRender(id);
    
            if (!infomation) {
                return res.status(404).json({ message: "Không tìm thấy độc giả" });
            }
    
            console.log("📌 Thông tin độc giả:", infomation);
            return res.status(200).json(infomation);
    
        } catch (error) {
            console.error("❌ Lỗi khi lấy thông tin độc giả:", error);
            return res.status(500).json({ message: "Lỗi server khi lấy thông tin độc giả!" });
        }
    }
    async updateReader(req, res) {
        try {
            console.log("Body nhận được:", req.body); // Debug
            const { id } = req.params;
            const { tenDocGia, cccd, diaChi, namSinh, sdt, avatar } = req.body;
    
            if (!id) return res.status(400).json({ message: "Thiếu mã độc giả!" });
    
            const success = await docGiaModel.updateReaderInfo(
                id, tenDocGia, cccd, diaChi, namSinh, sdt, avatar
            );
    
            if (success) return res.status(200).json({ message: "Cập nhật thành công!" });
    
            return res.status(404).json({ message: "Không tìm thấy độc giả!" });
        } catch (error) {
            console.error("❌ Lỗi cập nhật độc giả:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    }
}

module.exports = new DocGiaController();