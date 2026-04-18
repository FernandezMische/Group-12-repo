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

export const findEmployeeIdByName = async (name) => {
  const [rows] = await pool.query(
    'SELECT employeeId FROM employeeinformation WHERE name = ? LIMIT 1;',
    [name]
  );
  return rows[0]?.employeeId ?? null;
};

export const createLeaveApplication = async ({ employeeId, leaveDate, reason, leaveStatus }) => {
  const [result] = await pool.query(
    'INSERT INTO leaverequests (leaveDate, reason, leaveStatus, employeeId) VALUES (?, ?, ?, ?);',
    [leaveDate, reason, leaveStatus, employeeId]
  );
  return result.insertId;
};
