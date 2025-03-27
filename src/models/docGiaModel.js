const pool = require('../utils/connectDB');

const getAllDocGia = async () => {
    const sql = `SELECT * FROM docgia`;
    const [rows] = await pool.execute(sql);
    return rows;
}
const getAllNameDocGia = async () =>{
    const sql = `SELECT tenDocGia, maDocGia FROM docgia`;
    const [rows] = await pool.execute(sql);
    return rows;
}
const getLockStatus = async (maDocGia) => {
    const sql = 'SELECT lockAccount FROM DocGia WHERE maDocGia = ?';
    const [rows] = await pool.execute(sql, [maDocGia]);
    return rows.length ? rows[0] : null;
};
const getMaDocGia = async(tenDocGia) =>{
    const sql = `SELECT maDocGia, tenDocGia FROM docgia WHERE tenDocGia = ?`
    const [rows] = await pool.execute(sql, [tenDocGia]);
    return rows.length ? rows[0] : null;
}
// const updateLockStatus = async (maDocGia, lockAccount) => {
//     const sql = 'UPDATE DocGia SET lockAccount = ? WHERE maDocGia = ?';
//     const [result] = await pool.execute(sql, [lockAccount, maDocGia]);
//     return result.affectedRows > 0;
// };
const updateLockStatus = async (tenDangNhap, lockAccount) => {
    const sql = `
        UPDATE DocGia 
        JOIN TaiKhoan ON DocGia.maTaiKhoan = TaiKhoan.maTaiKhoan
        SET DocGia.lockAccount = ?
        WHERE TaiKhoan.tenDangNhap = ?
    `;

    const [result] = await pool.execute(sql, [lockAccount, tenDangNhap]);
    return result.affectedRows > 0;
};
const getInfomationRender = async (maDocGia) => {
    const sql = 'Select * FROM DocGia WHERE maDocGia = ?';
    const [rows] = await pool.execute(sql, [maDocGia]);
    return rows[0]
}
const updateReaderInfo = async (maDocGia, tenDocGia, cccd, diaChi, namSinh, sdt, avatar) => {
    const sql = `
        UPDATE DocGia 
        SET tenDocGia = ?, cccd = ?, diaChi = ?, namSinh = ?, sdt = ?, avatar = ?
        WHERE maDocGia = ?;
    `;
    const [result] = await pool.execute(sql, [tenDocGia, cccd, diaChi, namSinh, sdt, avatar, maDocGia]);
    return result.affectedRows > 0;
};
const createDocGia = async (maTaiKhoan) => {
    const sql = `
        INSERT INTO DocGia (maTaiKhoan, tenDocGia, cccd, diaChi, namSinh, sdt, ngayGiaNhap, avatar, lockAccount)
        VALUES (?, 'Chưa cập nhật', '00000000', NULL, NULL, NULL, CURDATE(), NULL, false)
    `;
    await pool.execute(sql, [maTaiKhoan]);
}

module.exports = {getAllDocGia, getLockStatus, updateLockStatus, getInfomationRender, updateReaderInfo, createDocGia, getAllNameDocGia, getMaDocGia}