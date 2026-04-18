import mysql from 'mysql2/promise';

// ✅ CORRECT - in all your model files
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { require: true }  // Required for TiDB Cloud
});

export const getAttendance_db = async () => {
    const [rows] = await pool.query(`
        SELECT 
            a.attendancedID,
            a.attendanceDate,
            a.status,
            a.employeeId,
            e.name AS employeeName
        FROM attendance a
        JOIN employeeInformation e 
            ON a.employeeId = e.employeeId
        ORDER BY a.employeeId, a.attendanceDate;
    `);

    return rows;
};


