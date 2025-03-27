const pool = require('../utils/connectDB');

const getAllCategories = async () => {
    const sql = 'SELECT * FROM TheLoai';
    const [rows] = await pool.execute(sql);
    return rows;
}
const addCategory = async (tenTheLoai) => {
    const sql = 'INSERT INTO TheLoai (tenTheLoai) VALUES (?)';
    await pool.execute(sql, [tenTheLoai]);
}
const findCategoryByName = async(tenTheLoai) =>{
    const sql = 'SELECT * FROM TheLoai WHERE tenTheLoai = ?';
    const [rows] = await pool.execute(sql, [tenTheLoai]);
    return rows[0];
    
}
const updateCategory = async (maTheLoai, tenTheLoai) => {
    const sql = 'UPDATE TheLoai SET tenTheLoai = ? WHERE maTheLoai = ?';
    await pool.execute(sql, [tenTheLoai, maTheLoai]);
}
const deleteCategory = async(maTheLoai) =>{
    const sql = 'DELETE FROM TheLoai WHERE maTheLoai = ?';
    const result = await pool.execute(sql, [maTheLoai]);
    return result
}
const findCategoryById = async(maTheLoai) =>{
    const sql = 'SELECT * FROM TheLoai WHERE maTheLoai = ?';
    const [rows] = await pool.execute(sql, [maTheLoai]);
    return rows[0];
}

module.exports = { getAllCategories, addCategory, updateCategory, findCategoryByName, deleteCategory, findCategoryById };