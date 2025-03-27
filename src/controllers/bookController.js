const bookModel = require('../models/bookModel');

class BookController {
    async getAllBooks(req, res) {
        const books = await bookModel.getAllBooks();
        res.json(books);
    }

    async createBook(req, res) {
        const { tenSach, maTheLoai, maKhu, soLuong } = req.body;
        await bookModel.addBook(tenSach, maTheLoai, maKhu, soLuong);
        res.json({ message: 'Thêm sách thành công' });
    }

    async updateBook(req, res) {
        const { maSach, tenSach, maTheLoai, maKhu, soLuong } = req.body;
        await bookModel.updateBook(maSach, tenSach, maTheLoai, maKhu, soLuong);
        res.json({ message: 'Cập nhật sách thành công' });
    }
    async deleteBook(req, res) {
        try {
            const  tenSach = req.params.tenSach;
            if (!tenSach) {
                return res.status(400).json({ message: "Thiếu tên sách!" });
            }
    
            const success = await bookModel.deleteBook(tenSach);
            if (success) {
                return res.status(200).json({ message: "Xóa sách thành công!" });
            }
        } catch (error) {
            console.error("❌ Lỗi xóa sách:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }        
    }

    // async deleteBook(req, res) {
    //     const { maSach } = req.body;
    //     await bookModel.deleteBook(maSach);
    //     res.json({ message: 'Xóa sách thành công' });
    // }
    // async addBook(req, res) {
    //     try {
    //         const { tenSach, tacGia, maTheLoai, ngayXuatBan, soLuong, gia, maKhu, hinhAnh } = req.body;

    //         // Kiểm tra dữ liệu đầu vào
    //         if (!tenSach || !tacGia || !maTheLoai || !ngayXuatBan || !soLuong || !gia || !maKhu) {
    //             return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin sách!" });
    //         }

    //         // Thêm sách vào database
    //         const result = await bookModel.addBook(tenSach, tacGia, maTheLoai, ngayXuatBan, soLuong, gia, maKhu, hinhAnh);

    //         // Kiểm tra xem có thành công không
    //         if (result[0].affectedRows > 0) {
    //             return res.status(201).json({ message: "Thêm sách thành công!" });
    //         } else {
    //             return res.status(500).json({ message: "Không thể thêm sách!" });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: "Lỗi server khi thêm sách!", error });
    //     }
    // }
    async addBook(req, res) {
        try {
            const { tenSach, tacGia, maTheLoai, ngayXuatBan, soLuong, gia, maKhu } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null; // Lấy đường dẫn ảnh từ multer
            const exist = await bookModel.findBookByName(tenSach)
            if(exist){
                return res.status(400).json({ message: "Tên sách đã tồn tại!" });
            }
            // Kiểm tra dữ liệu đầu vào
            if (!tenSach || !tacGia || !maTheLoai || !ngayXuatBan || !soLuong || !gia || !maKhu) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin sách!" });
            }

            // Thêm sách vào database
            const result = await bookModel.addBook(
                tenSach,
                tacGia,
                maTheLoai,
                ngayXuatBan,
                soLuong,
                gia,
                maKhu,
                image
            );

            // Kiểm tra xem có thành công không
            if (result.affectedRows > 0) { // Sửa lại từ result[0].affectedRows thành result.affectedRows vì model trả về result trực tiếp
                return res.status(201).json({ message: "Thêm sách thành công!" });
            } else {
                return res.status(500).json({ message: "Không thể thêm sách!" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Lỗi server khi thêm sách!" + error });
        }
    };
    async getAllNameBooks(req, res){
        try{
            const books = await bookModel.getAllNameBooks();
            return res.status(200).json({books});
        }catch(error){
            return res.status(500).json({message: "Lỗi server", error})
        }
    }
    async findBookByName(req, res){
        try{
            const tenSach = req.query.tenSach
            console.log(tenSach)
            const book = await bookModel.getBookByNameBook(tenSach)
            if(book){
                return res.status(200).json({book});
            }
            return res.status(404).json({message: "Không tìm thấy sách!"});
        }catch(error){
            return res.status(500).json({message: "Lỗi server", error})
        }
    }
}

module.exports = new BookController;


