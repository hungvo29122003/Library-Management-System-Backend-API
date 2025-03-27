const pool = require('../utils/connectDB');

// const getAllAccounts = async () => {
//     const sql = 'SELECT * FROM TaiKhoan';
//     const [rows] = await pool.execute(sql);
//     return rows;
// };
// const getAllAccounts = async (vaiTro) => {
//     let sql;
    
//     if (vaiTro === "DocGia") {
//         sql = `
//             SELECT TaiKhoan.*, DocGia.lockAccount 
//             FROM TaiKhoan 
//             LEFT JOIN DocGia ON TaiKhoan.maTaiKhoan = DocGia.maTaiKhoan
//             WHERE TaiKhoan.vaiTro = ?`;
//     } else if (vaiTro === "ThuThu" || vaiTro === "QuanLy") {
//         sql = `SELECT * FROM TaiKhoan WHERE vaiTro = ?`;
//     } else {
//         return []; // Trả về mảng rỗng nếu vai trò không hợp lệ
//     }

//     const [rows] = await pool.execute(sql, [vaiTro]);
//     return rows;
// };
const getAllAccounts = async (vaiTro) => {
    let sql;
    
    if (vaiTro === "DocGia") {
        sql = `
            SELECT TaiKhoan.*, DocGia.lockAccount 
            FROM TaiKhoan 
            LEFT JOIN DocGia ON TaiKhoan.maTaiKhoan = DocGia.maTaiKhoan
            WHERE TaiKhoan.vaiTro = ?`;
    } else if (vaiTro === "ThuThu" || vaiTro === "QuanLy") {
        sql = `SELECT * FROM TaiKhoan WHERE vaiTro = ?`;
    } else {
        return []; // Trả về mảng rỗng nếu vai trò không hợp lệ
    }

    const [rows] = await pool.execute(sql, [vaiTro]);

    // Ánh xạ lockAccount từ 0/1 sang true/false
    const accounts = rows.map(row => {
        return {
            ...row,
            lockAccount: row.lockAccount === 1 ? true : row.lockAccount === 0 ? false : null
        };
    });

    return accounts;
};
const findAccountByUsername = async (tenDangNhap) => {
    const sql = 'SELECT * FROM TaiKhoan WHERE tenDangNhap = ?';
    const [rows] = await pool.execute(sql, [tenDangNhap]);
    return rows[0];
};
const findAccountByEmail = async (email) => {
    const sql = 'SELECT * FROM TaiKhoan WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
};

const createAccount = async (username, hashedPassword, email, role) => {
    const sql = 'INSERT INTO TaiKhoan (tenDangNhap, matKhau, email, vaiTro) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [username, hashedPassword, email, role]);

    return result.insertId; // ✅ Trả về ID của tài khoản mới
};
const getAccountById = async (id) => {
    const sql = 'SELECT * FROM TaiKhoan WHERE maTaiKhoan = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
}
const updateAccount = async (id,matKhau, email, role, trangThai) => {
    const sql = 'UPDATE TaiKhoan SET matKhau = ?, email = ?, vaiTro = ?, trangThai = ? WHERE maTaiKhoan = ?';
    await pool.execute(sql, [matKhau, email, role,trangThai, id]);
}
// const deleteAccount = async (id) => {
//     const sql = 'DELETE FROM TaiKhoan WHERE maTaiKhoan = ?';
//     await pool.execute(sql, [id]);
// }
const deleteAccount = async (tenDangNhap) => {
    const sql = 'DELETE FROM TaiKhoan WHERE tenDangNhap = ?';
    const [result] = await pool.execute(sql, [tenDangNhap]);
    return result.affectedRows > 0;
};
const getManagerInfo = async (id) => {
    const sql = `
        SELECT 
            tk.maTaiKhoan, tk.tenDangNhap, tk.email, tk.vaiTro, tk.trangThai,
            ql.maQuanLy, ql.tenQuanLy, ql.cccd, ql.diaChi, ql.sdt, ql.namSinh, ql.avatar
        FROM TaiKhoan tk
        JOIN QuanLy ql ON tk.maTaiKhoan = ql.maTaiKhoan
        WHERE tk.maTaiKhoan = ?;
    `;

    const [rows] = await pool.execute(sql, [id]);
    return rows[0]; 
};
const getLibrarianInfo = async (id) => {
    const sql = `
        SELECT 
            tk.maTaiKhoan, tk.tenDangNhap, tk.email, tk.vaiTro, tk.trangThai,
            tt.maThuThu, tt.tenThuThu, tt.cccd, tt.diaChi, tt.sdt, tt.namSinh, tt.avatar
        FROM TaiKhoan tk
        JOIN ThuThu tt ON tk.maTaiKhoan = tt.maTaiKhoan
        WHERE tk.maTaiKhoan = ?;
    `;

    const [rows] = await pool.execute(sql, [id]);
    return rows[0]; 
};
const getReaderInfo = async (id) => {
    const sql = `
        SELECT 
            tk.maTaiKhoan, tk.tenDangNhap, tk.email, tk.vaiTro, tk.trangThai,
            dg.maDocGia, dg.tenDocGia, dg.cccd, dg.namSinh, dg.sdt, dg.ngayGiaNhap, dg.avatar, dg.lockAccount
        FROM TaiKhoan tk
        JOIN DocGia dg ON tk.maTaiKhoan = dg.maTaiKhoan
        WHERE tk.maTaiKhoan = ?;
    `;

    const [rows] = await pool.execute(sql, [id]);
    return rows[0]; 
};
const updateManagerInfo = async (id, data) => {
    const sql = `
        UPDATE QuanLy 
        SET tenQuanLy = ?, cccd = ?, diaChi = ?, sdt = ?, email = ?, namSinh = ?, avatar = ?
        WHERE maTaiKhoan = ?;
    `;
    const [result] = await pool.execute(sql, [
        data.tenQuanLy,
        data.cccd,
        data.diaChi,
        data.sdt,
        data.email,
        data.namSinh,
        data.avatar,
        id
    ]);
    return result.affectedRows;
};

const updateLibrarianInfo = async (id, data) => {
    const sql = `
        UPDATE ThuThu 
        SET tenThuThu = ?, cccd = ?, diaChi = ?, sdt = ?, email = ?, namSinh = ?, avatar = ?
        WHERE maTaiKhoan = ?;
    `;
    const [result] = await pool.execute(sql, [
        data.tenThuThu,
        data.cccd,
        data.diaChi,
        data.sdt,
        data.email,
        data.namSinh,
        data.avatar,
        id
    ]);
    return result.affectedRows;
};

const updateReaderInfo = async (id, data) => {
    const sql = `
        UPDATE DocGia 
        SET tenDocGia = ?, cccd = ?, diachi = ?, namSinh = ?, sdt = ?, email = ?, ngayGiaNhap = ?, avatar = ?, lockAccount = ?
        WHERE maTaiKhoan = ?;
    `;
    const [result] = await pool.execute(sql, [
        data.tenDocGia,
        data.cccd,
        data.diaChi,
        data.namSinh,
        data.sdt,
        data.email,
        data.ngayGiaNhap,
        data.avatar,
        data.lockAccount,
        id
    ]);
    return result.affectedRows;
};
const addReaderInfo = async (id, data) => {
    const sql = `
        INSERT INTO DocGia (maTaiKhoan, tenDocGia, cccd, diachi, namSinh, sdt, email, ngayGiaNhap, avatar, lockAccount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await pool.execute(sql, [
        id,
        data.tenDocGia,
        data.cccd,
        data.diaChi,
        data.namSinh,
        data.sdt,
        data.email,
        data.ngayGiaNhap,
        data.avatar,
        data.lockAccount
    ]);
    return result.affectedRows;
}
const addManagerInfo = async (id, data) => {
    const sql = `
        INSERT INTO QuanLy (maTaiKhoan, tenQuanLy, cccd, diachi, namSinh, sdt, email, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await pool.execute(sql, [
        id,
        data.tenQuanLy,
        data.cccd,
        data.diaChi,
        data.namSinh,
        data.sdt,
        data.email,
        data.avatar
    ]);
    return result.affectedRows;
}
const addLibrarianInfo = async (id, data) => {
    const sql = `
        INSERT INTO ThuThu (maTaiKhoan, tenThuThu, cccd, diachi, namSinh, sdt, email, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await pool.execute(sql, [
        id,
        data.tenThuThu,
        data.cccd,
        data.diaChi,
        data.namSinh,
        data.sdt,
        data.email,
        data.avatar
    ]);
    return result.affectedRows;
}

module.exports = { getAllAccounts, findAccountByUsername, findAccountByEmail, createAccount, getAccountById, updateAccount,
deleteAccount, getManagerInfo, getLibrarianInfo, getReaderInfo, updateManagerInfo, updateLibrarianInfo, updateReaderInfo,
addReaderInfo, addManagerInfo, addLibrarianInfo
 };
