const pool = require('../utils/connectDB');

const getAllBooks = async () => {
    const sql = `
        SELECT 
            Sach.maSach, 
            Sach.tenSach, 
            Sach.tacGia, 
            TheLoai.tenTheLoai, 
            Sach.ngayXuatBan, 
            Sach.soLuong, 
            Sach.gia, 
            Khu.tenKhu, 
            Sach.image
        FROM Sach
        LEFT JOIN TheLoai ON Sach.maTheLoai = TheLoai.maTheLoai
        LEFT JOIN Khu ON Sach.maKhu = Khu.maKhu;
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}
const getBookByName = async (tenSach) => {
    const sql = `
        SELECT 
            Sach.maSach, 
            Sach.tenSach, 
            Sach.tacGia, 
            TheLoai.tenTheLoai, 
            Sach.ngayXuatBan, 
            Sach.soLuong, 
            Sach.gia, 
            Khu.tenKhu, 
            Sach.image
        FROM Sach
        LEFT JOIN TheLoai ON Sach.maTheLoai = TheLoai.maTheLoai
        LEFT JOIN Khu ON Sach.maKhu = Khu.maKhu
        WHERE Sach.tenSach = ?`;
    const [rows] = await pool.execute(sql, [tenSach]);
    return rows[0];
}
const findBookByName = async(tenSach) =>{
    const sql = `select tenSach from Sach where tenSach like ?`;
    const [rows] = await pool.execute(sql, [`%${tenSach}%`]);
    return rows[0];
}
const getBookbyAuthor = async (tacGia) =>{
    const sql = `
        SELECT 
            Sach.maSach, 
            Sach.tenSach, 
            Sach.tacGia, 
            TheLoai.tenTheLoai, 
            Sach.ngayXuatBan, 
            Sach.soLuong, 
            Sach.gia, 
            Khu.tenKhu, 
            Sach.image
        FROM Sach
        LEFT JOIN TheLoai ON Sach.maTheLoai = TheLoai.maTheLoai
        LEFT JOIN Khu ON Sach.maKhu = Khu.maKhu
        WHERE Sach.tacGia = ?`;
    const [rows] = await pool.execute(sql, [tacGia]);
    return rows;
}
const addBook = async (tenSach, tacGia, maTheLoai, ngayXuatBan, soLuong, gia, maKhu, image) => {
    const sql = `
        INSERT INTO Sach (tenSach, tacGia, maTheLoai, ngayXuatBan, soLuong, gia, maKhu, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
        tenSach,
        tacGia,
        parseInt(maTheLoai),
        ngayXuatBan,
        parseInt(soLuong),
        parseFloat(gia),
        parseInt(maKhu),
        image
    ]);
    return result; // Trả về kết quả của truy vấn (bao gồm affectedRows)
};
const updateBook = async (maSach, tenSach, tacGia, maTheLoai, ngayXuatBan, maTrangThai, soLuong, gia, maKhu) => {
    const sql = `UPDATE Sach SET tenSach = ?, tacGia = ?, maTheLoai = ?, ngayXuatBan = ?, maTrangThai = ?, soLuong = ?, gia = ?, maKhu = ? WHERE maSach = ?`;
    const result =  await pool.execute(sql, [tenSach, tacGia, maTheLoai, ngayXuatBan, maTrangThai, soLuong, gia, maKhu, maSach]);
    return result.affectedRows;
}
const deleteBook = async (tenSach) => {
    const sql = `DELETE FROM Sach WHERE tenSach = ?`;
    const result = await pool.execute(sql, [tenSach]);
    return result.affectedRows > 0;
}
const getAllNameBooks = async () =>{
    const sql = `SELECT tenSach, maSach FROM Sach`;
    const [rows] = await pool.execute(sql);
    return rows;
}
const getPriceByNameBook = async (tenSach) =>{
    const sql = `select gia from Sach where tenSach = ?`;
    const [rows] = await pool.execute(sql, [tenSach]);
    return rows;
}
const getBookByNameBook = async (tenSach) => {
    const sql = `SELECT 
            Sach.maSach, 
            Sach.tenSach, 
            Sach.tacGia, 
            TheLoai.tenTheLoai, 
            Sach.ngayXuatBan, 
            Sach.soLuong, 
            Sach.gia, 
            Khu.tenKhu, 
            Sach.image
        FROM Sach
        LEFT JOIN TheLoai ON Sach.maTheLoai = TheLoai.maTheLoai
        LEFT JOIN Khu ON Sach.maKhu = Khu.maKhu
        WHERE Sach.tenSach LIKE ?;`;
    const [rows] = await pool.execute(sql, [tenSach + "%"]);
    return rows
}
module.exports = { getAllBooks, getBookByNameBook,getBookByName, getBookbyAuthor, addBook, updateBook, deleteBook, findBookByName, getAllNameBooks, getPriceByNameBook };          
    