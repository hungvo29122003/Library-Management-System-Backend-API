const pool = require('../utils/connectDB');

const createQuanLy = async (maTaiKhoan) =>{
    const sql = `
        INSERT INTO QuanLy (maTaiKhoan, tenQuanLy, cccd, diaChi, sdt, namSinh, avatar)
        VALUES (?, 'Chưa cập nhật', '010100000000', NULL, NULL, NULL, NULL)
    `;
    await pool.execute(sql, [maTaiKhoan]);
}
const getQuanLy = async() => {
    const sql = `select * from QuanLy`;
    const [rows] = await pool.execute(sql);
    return rows;
}
const getInfomationManager = async (id) => {
    const sql = "SELECT * FROM QuanLy WHERE maQuanLy = ?";
    const [rows] = await pool.execute(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
};
const updateManagerInfo = async (maQuanLy, tenQuanLy, cccd, diaChi, namSinh, sdt, avatar) => {
    const sql = `
        UPDATE QuanLy 
        SET tenQuanLy = ?, cccd = ?, diaChi = ?, namSinh = ?, sdt = ?, avatar = ?
        WHERE maQuanLy = ?;
    `;
    const [result] = await pool.execute(sql, [tenQuanLy, cccd, diaChi, namSinh, sdt, avatar, maQuanLy]);
    return result.affectedRows > 0;
};
const getQuanLyByTaiKhoan = async (maTaiKhoan) => {
    const sql = "SELECT maQuanLy FROM QuanLy WHERE maTaiKhoan = ?";
    const [rows] = await pool.execute(sql, [maTaiKhoan]);
    return rows.length > 0 ? rows[0] : null;
};
const updateQuanLyInfo = async (maQuanLy, tenQuanLy, cccd, diaChi, namSinh, sdt, avatar) => {
    const sql = `
        UPDATE QuanLy 
        SET tenQuanLy = ?, cccd = ?, diaChi = ?, namSinh = ?, sdt = ?, avatar = ?
        WHERE maQuanLy = ?;
    `;
    const [result] = await pool.execute(sql, [tenQuanLy, cccd, diaChi, namSinh, sdt, avatar, maQuanLy]);
    return result.affectedRows > 0;
};
const getInfomationQuanLy = async (maThuThu) => {
    const sql = `
        SELECT q.*, tk.email 
        FROM QuanLy q
        JOIN TaiKhoan tk ON q.maTaiKhoan = tk.maTaiKhoan
        WHERE q.maQuanLy = ?`;
    const [rows] = await pool.execute(sql, [maThuThu]);
    return rows.length > 0 ? rows[0] : null;
};
module.exports = {createQuanLy, getInfomationQuanLy, updateQuanLyInfo, getQuanLyByTaiKhoan, getQuanLy, getInfomationManager, updateManagerInfo};