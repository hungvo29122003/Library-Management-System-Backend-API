const pool = require('../utils/connectDB');

const createThuThu = async (maTaiKhoan) => {
    const sql = `
        INSERT INTO ThuThu (maTaiKhoan, tenThuThu, cccd, diaChi, sdt, namSinh, avatar)
        VALUES (?, 'Chưa cập nhật', '000000000000', NULL, NULL, NULL, NULL)
    `;
    await pool.execute(sql, [maTaiKhoan]);
}

const getThuThu = async () => {
    const sql = `SELECT * FROM ThuThu`;
    const [rows] = await pool.execute(sql);
    return rows;
};

// 🟢 Lấy thông tin chi tiết một thủ thư theo ID
const getInfomationThuThu = async (maThuThu) => {
    const sql = `
        SELECT t.*, tk.email 
        FROM ThuThu t
        JOIN TaiKhoan tk ON t.maTaiKhoan = tk.maTaiKhoan
        WHERE t.maThuThu = ?`;
    const [rows] = await pool.execute(sql, [maThuThu]);
    return rows.length > 0 ? rows[0] : null;
};
const getThuThuByTaiKhoan = async (maTaiKhoan) => {
    const sql = "SELECT maThuThu FROM ThuThu WHERE maTaiKhoan = ?";
    const [rows] = await pool.execute(sql, [maTaiKhoan]);
    return rows.length > 0 ? rows[0] : null;
};

// 🟢 Cập nhật thông tin thủ thư
const updateThuThuInfo = async (maThuThu, tenThuThu, cccd, diaChi, namSinh, sdt, avatar) => {
    const sql = `
        UPDATE ThuThu 
        SET tenThuThu = ?, cccd = ?, diaChi = ?, namSinh = ?, sdt = ?, avatar = ?
        WHERE maThuThu = ?;
    `;
    const [result] = await pool.execute(sql, [tenThuThu, cccd, diaChi, namSinh, sdt, avatar, maThuThu]);
    return result.affectedRows > 0;
};
module.exports = { createThuThu, getThuThu, getInfomationThuThu, updateThuThuInfo, getThuThuByTaiKhoan };