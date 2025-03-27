const pool = require('../utils/connectDB');

const getAllZones = async () => {
    const sql = 'SELECT maKhu, tenKhu FROM Khu';
    const [rows] = await pool.execute(sql);
    return rows;
}
const addZone = async (tenKhu) => {
    const sql = 'INSERT INTO Khu (tenKhu) VALUES (?)';
    await pool.execute(sql, [tenKhu]);
}
const deleteZone = async(maKhu) =>{
    const sql = 'DELETE FROM Khu WHERE maKhu = ?';
    await pool.execute(sql, [maKhu]);   
}
const findZoneById = async(maKhu) =>{
    const sql = 'SELECT * FROM Khu WHERE maKhu = ?';
    const [rows] = await pool.execute(sql, [maKhu]);
    return rows[0];
}
module.exports = { getAllZones, addZone, deleteZone, findZoneById };