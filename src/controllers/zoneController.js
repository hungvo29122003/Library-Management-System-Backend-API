const zonesModel = require('../models/zone')

class ZoneController {
    async getZones(req, res){
        try {
            const zones = await zonesModel.getAllZones()
            console.log("Danh sách khu: ", zones)
            return res.status(201).json(zones)
        } catch (err){
            console.log(err)
            return res.status(500).json({ message: "Lỗi server khi lấy danh sách khu!" });
        }
    }
    async deleteZone(req, res){
        try {
            const { id } = req.params;
            console.log(req.params); 
            console.log(id)
            const exist = await zonesModel.findZoneById(id)
            if(!exist){
                return res.status(400).json({message: "Khu không tồn tại!"})
            }
            const result = await zonesModel.deleteZone(id)
            return res.status(200).json({message: "Xóa thành công!"})
        } catch(error){
            console.log(error)
            return res.status(500).json({message: "Lỗi server khi xóa khu!", error})
        }
    }
}

module.exports = new ZoneController()