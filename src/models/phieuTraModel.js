const pool = require('../utils/connectDB');

const getPhieuTra = async () => {
    const sql = `
        SELECT 
            pt.maPhieuTra,
            pt.maPhieuMuon,
            tt.tenThuThu,
            dg.tenDocGia,
            pt.ngayTra,
            pt.tongTien
        FROM PhieuTra pt
        JOIN PhieuMuon pm ON pt.maPhieuMuon = pm.maPhieuMuon
        JOIN ThuThu tt ON pt.maThuThu = tt.maThuThu
        JOIN DocGia dg ON pm.maDocGia = dg.maDocGia;
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};
const addPhieuTra = async (maPhieuMuon, maThuThu, ngayTra, tongTien) => {
    const sql = `
        INSERT INTO PhieuTra (maPhieuMuon, maThuThu, ngayTra, tongTien)
        VALUES (?, ?, ?,?)
    `;
    const [result] = await pool.execute(sql, [maPhieuMuon, maThuThu, ngayTra, tongTien]);
    return result;
};
const getLastPhieuTraId = async () => {
    const sql = `SELECT MAX(maPhieuTra) AS maPhieuTra FROM PhieuTra`;
    const [rows] = await pool.execute(sql);
    return rows[0].maPhieuTra;
};
const addChiTietPhieuTra = async (maPhieuTra, danhSachSach) => {
    const sql = `
        INSERT INTO ChiTietPhieuTra (maPhieuTra, maSach, soLuong, trangThaiSach, phiPhat)
        VALUES (?, ?, ?, ?, ?)
    `;
    for (let sach of danhSachSach) {
        await pool.execute(sql, [
            maPhieuTra,
            sach.maSach,
            sach.soLuong || 1,
            sach.trangThaiSach || "Bình thường", // Đảm bảo có giá trị hợp lệ
            sach.phiPhat || 0.0 // Đảm bảo không bị thiếu giá trị
        ]);
    }
};
const  tangSoLuongSach = async (maSach, soLuong) => {
    const sql = `UPDATE Sach SET soLuong = soLuong + ? WHERE maSach = ?`;
    const [result] = await pool.execute(sql, [soLuong, maSach]);
    return result.affectedRows > 0;
}
const getChiTietPhieuTra = async (id) => {
    const sql = 'SELECT * FROM ChiTietPhieuTra WHERE maPhieuTra = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows;
}
module.exports = { getPhieuTra, addPhieuTra , getLastPhieuTraId, tangSoLuongSach, addChiTietPhieuTra, getChiTietPhieuTra };