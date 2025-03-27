const pool = require('../utils/connectDB');

const getAllLoanSlips = async () => {
    const sql = `
        SELECT 
            pm.maPhieuMuon, 
            tt.tenThuThu, 
            dg.tenDocGia, 
            pm.ngayMuon
        FROM PhieuMuon pm
        JOIN ThuThu tt ON pm.maThuThu = tt.maThuThu
        JOIN DocGia dg ON pm.maDocGia = dg.maDocGia
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}
const addPhieuMuon = async (maThuThu, maDocGia, ngayMuon) => {
    const sql = `
        INSERT INTO PhieuMuon (maThuThu, maDocGia, ngayMuon)
        VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [maThuThu, maDocGia, ngayMuon]);
    return result;
};

// Lấy mã phiếu mượn mới nhất
const getLastPhieuMuonId = async () => {
    const sql = `SELECT MAX(maPhieuMuon) AS maPhieuMuon FROM PhieuMuon`;
    const [rows] = await pool.execute(sql);
    return rows[0].maPhieuMuon;
};
const giamSoLuongSach = async(maSach, soLuong) =>{
    const sql = `UPDATE Sach SET soLuong = soLuong - ? WHERE maSach = ? AND soLuong >= ?`;
    const [result] = await pool.execute(sql, [soLuong, maSach, soLuong]);
    return result.affectedRows > 0;
}

// Thêm chi tiết phiếu mượn
const addChiTietPhieuMuon = async (maPhieuMuon, danhSachSach) => {
    const sql = `
        INSERT INTO ChiTietPhieuMuon (maPhieuMuon, maSach, soLuong)
        VALUES (?, ?, ?)
    `;
    for (let sach of danhSachSach) {
        await pool.execute(sql, [maPhieuMuon, sach.maSach, sach.soLuong || 0]);
    }
};
const getLoanSlipById = async (id) => {
    const sql = 'SELECT * FROM PhieuMuon WHERE maPhieuMuon = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
}
const getChiTietPhieuMuon = async (id) => {
    const sql = `
        SELECT 
            ctp.maChiTiet, 
            s.tenSach, 
            ctp.soLuong,
            s.gia,
            s.maSach
        FROM ChiTietPhieuMuon ctp
        JOIN Sach s ON ctp.maSach = s.maSach
        WHERE ctp.maPhieuMuon = ?;
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows;
};
module.exports = { getAllLoanSlips, addPhieuMuon, getLastPhieuMuonId, addChiTietPhieuMuon, getLoanSlipById, getChiTietPhieuMuon, giamSoLuongSach };