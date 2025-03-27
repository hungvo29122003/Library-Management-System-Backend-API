const accountModel = require('../models/accountModel');
const quanLyModel = require('../models/quanLyModel');
const thuThuModel = require('../models/thuThuModel');
const docGiaModel = require('../models/docGiaModel')
const bcrypt = require('bcrypt');
const auth = require('../utils/auth');

class AuthController {
    // async register(req, res) {
    //     try {
    //         const { tenDangNhap, matKhau, email, vaiTro } = req.body;
    //         console.log
    //         const existingUser = await accountModel.findAccountByUsername(tenDangNhap);

    //         if (existingUser) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    //         const existingEmail = await accountModel.findAccountByEmail(email);

    //         if (existingEmail) return res.status(400).json({ message: 'Email đã tồn tại!' });
    //         const hashedPassword = await bcrypt.hash(matKhau, 10);

    //         await accountModel.createAccount(tenDangNhap, hashedPassword, email, vaiTro);
    //         res.status(201).json({ message: 'Đăng ký thành công!',});
    //     } catch (error) {
    //         console.error("Lỗi đăng ký:", error);
    //         res.status(500).json({ message: 'Lỗi server!' });
    //     }
    // }
    async register(req, res) {
        try {
            const { tenDangNhap, matKhau, email, vaiTro } = req.body;
    
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            const existingUser = await accountModel.findAccountByUsername(tenDangNhap);
            if (existingUser) {
                return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
            }
    
            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await accountModel.findAccountByEmail(email);
            if (existingEmail) {
                return res.status(400).json({ message: 'Email đã tồn tại!' });
            }
    
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(matKhau, 10);
    
            // Tạo tài khoản mới và lấy mã tài khoản
            const maTaiKhoan = await accountModel.createAccount(tenDangNhap, hashedPassword, email, vaiTro);
            console.log(maTaiKhoan)
            // Thêm vào bảng tương ứng với vai trò
            if (vaiTro === "DocGia") {
                await docGiaModel.createDocGia(maTaiKhoan);
            } else if (vaiTro === "ThuThu") {
                await thuThuModel.createThuThu(maTaiKhoan);
            } else if (vaiTro === "QuanLy") {
                await quanLyModel.createQuanLy(maTaiKhoan);
            } else {
                return res.status(400).json({ message: "Vai trò không hợp lệ!" });
            }
            console.log(thuThuModel, docGiaModel, quanLyModel)
            res.status(201).json({ message: 'Đăng ký thành công!' });
    
        } catch (error) {
            console.error("❌ Lỗi đăng ký:", error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    };    
    async login(req, res) {
        try {
            const { tenDangNhap, matKhau } = req.body;
            console.log(tenDangNhap, matKhau);
            const account = await accountModel.findAccountByUsername(tenDangNhap);

            if (!account || !(await bcrypt.compare(matKhau, account.matKhau))) {
                return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
            }

            const accessToken = auth.generateAccessToken(account);
            res.cookie('accessToken', accessToken, {httpOnly: true});
            // res.redirect('/');
            res.json({ message: 'Đăng nhập thành công', accessToken,
                User: {
                    id: account.maTaiKhoan,
                    tenDangNhap: account.tenDangNhap,
                    vaiTro: account.vaiTro
                }
             });
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
    async getAllAccounts(req, res) {
        try {
            const account = await accountModel.getAllAccounts();
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
    async getAccountsByRole(req, res) {
        try {
            const { role } = req.query;  // Lấy vai trò từ query params
            if (!role) {
                return res.status(400).json({ message: "Thiếu vai trò!" });
            }
    
            const accounts = await accountModel.getAllAccounts(role);
            return res.status(200).json({ accounts });
        } catch (error) {
            console.error("❌ Lỗi lấy danh sách tài khoản:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    }
    async getAccountById(req, res) {
        try {
            const id = req.params.id;
            console.log(id);
            const account = await accountModel.getAccountById(id);
            if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!' });
        }
    };
    async getAccountByUsername(req, res) {
        try {
            const tenDangNhap = req.query.username;
            console.log(tenDangNhap);
            const account = await accountModel.findAccountByUsername(tenDangNhap);
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!' });
        }
    };
    async logout(req, res) {
        res.clearCookie('accessToken');
        res.json({ message: 'Đăng xuất thành công'});
    };
    async updateAccount(req, res) {
        try {
            const { matKhau, email, vaiTro, trangThai } = req.body;
            console.log( matKhau, email, vaiTro, trangThai);
            const id = req.params.id;
            console.log(id);
            const hashedPassword = await bcrypt.hash(matKhau, 10);
            await accountModel.updateAccount(id, hashedPassword, email, vaiTro, trangThai);
            res.status(200).json({ message: 'Cập nhật tài khoản thành công' });
        } catch (error) {
            console.error("Lỗi cập nhật tài khoản:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    };
    // async deleteAccount(req, res){
    //     try {
    //         const id = req.params.id;
    //         console.log(id);
    //         await accountModel.deleteAccount(id);
    //         res.status(200).json({ message: 'Xóa tài khoản thành công' });
    //     } catch (error) {
    //         console.error("Lỗi xóa tài khoản:", error);
    //         res.status(500).json({ message: 'Lỗi server!' });
    //     }
    // };
    async deleteAccount(req, res) {
        try {
            const  tenDangNhap = req.params.tenDangNhap;
            if (!tenDangNhap) {
                return res.status(400).json({ message: "Thiếu tên đăng nhập!" });
            }
    
            const success = await accountModel.deleteAccount(tenDangNhap);
            if (success) {
                return res.status(200).json({ message: "Xóa tài khoản thành công!" });
            }
    
            return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
        } catch (error) {
            console.error("❌ Lỗi xóa tài khoản:", error);
            return res.status(500).json({ message: "Lỗi server!", error });
        }
    }
    async getAccountInfo(req, res) {
        try {
            const id = req.params.id;
            console.log("Lấy thông tin tài khoản ID:", id);
    
            let account = null;
    
            // Kiểm tra tài khoản thuộc vai trò nào
            account = await accountModel.getManagerInfo(id);
            if (account) return res.status(200).json(account);
    
            account = await accountModel.getLibrarianInfo(id);
            if (account) return res.status(200).json(account);
    
            account = await accountModel.getReaderInfo(id);
            if (account) return res.status(200).json(account);

            return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
        } catch (error) {
            console.error("Lỗi lấy thông tin tài khoản:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    }
    async updateAccountInfo(req, res) {
        try {
            const id = req.params.id;
            // console.log(id);
            const data = req.body;
            // console.log("Request body:", req.body);
            console.log("Cập nhật thông tin tài khoản ID:", id);
            console.log("Dữ liệu cập nhật:", data);
            if(data == null){
                return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
            }

            let updatedRows = 0;
            if(data.tenQuanLy){
                console.log(data.tenQuanLy);
                updatedRows = await accountModel.updateManagerInfo(id, data);
                if (updatedRows > 0) return res.status(200).json({ message: "Cập nhật Quản lý thành công!" });
            }

            if(data.tenThuThu){
                console.log(data.tenThuThu);
                updatedRows = await accountModel.updateLibrarianInfo(id, data);
                if (updatedRows > 0) return res.status(200).json({ message: "Cập nhật Thủ thư thành công!" });
            }

            if(data.tenDocGia){
                console.log(data.tenDocGia);
                updatedRows = await accountModel.updateReaderInfo(id, data);
                if (updatedRows > 0) return res.status(200).json({ message: "Cập nhật Độc giả thành công!" });
            }
            return res.status(404).json({ message: "Không tìm thấy tài khoản để cập nhật!" });
        } catch (error) {
            console.error("Lỗi cập nhật tài khoản:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    }
    async addReaderInfo(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            console.log(id);
            console.log(data);
            const result = await accountModel.addReaderInfo(id, data);
            res.status(200).json({ message: 'Thêm thông tin độc giả thành công', result });
        } catch (error) {
            console.error("Lỗi thêm thông tin độc giả:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
    async addManagerInfo(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            console.log(id);
            console.log(data);
            const result = await accountModel.addManagerInfo(id, data);
            res.status(200).json({ message: 'Thêm thông tin quản lý thành công', result });
        } catch (error) {
            console.error("Lỗi thêm thông tin quản lý:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
    async addLibrarianInfo(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            console.log(id);
            console.log(data);
            const result = await accountModel.addLibrarianInfo(id, data);
            res.status(200).json({ message: 'Thêm thông tin thủ thư thành công', result });
        } catch (error) {
            console.error("Lỗi thêm thông tin thủ thư:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
}

module.exports = new AuthController;