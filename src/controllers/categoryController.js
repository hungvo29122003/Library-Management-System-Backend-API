const { model } = require('mongoose');
const categoryModel = require('../models/categoryModel');

class CategoryController {
    async getAllCategory(req, res) {
        try {
            const categories = await categoryModel.getAllCategories();
            console.log(categories)
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).send(error)
        }
    }
    async addCategory(req, res){
        try{
            const {tenTheLoai} = req.body
            console.log(tenTheLoai)
            const name = await categoryModel.findCategoryByName(tenTheLoai)
            if(name){
                res.status(400).json({message: "Thể loại đã tồn tại"})
            }
            const category = await categoryModel.addCategory(tenTheLoai)
            res.status(201).json({ message: "Thêm thẻ loại thành công!", category });
        } catch (error){
            res.status(500).send({ message: 'Lỗi server!' + error})
        }
    }
    async deleteCategory(req, res) {
        try {
            const {id} = req.params
            console.log("Xóa thể loại có ID:", id);
            const maTheLoai = await categoryModel.findCategoryById(id)
            if (!maTheLoai) {
                return res.status(404).json({ message: "Thể loại không tồn tại" })
            }
            await categoryModel.deleteCategory(id)
            return res.status(200).json({ message: "Xóa thể loại thành công" })
        } catch(error){
            return res.status(500).send({ message: 'Lỗi server!' + error})
        }
    }

}

module.exports = new CategoryController