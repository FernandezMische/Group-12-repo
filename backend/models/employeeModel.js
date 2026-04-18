
import mysql from 'mysql2/promise';

//  DB connection using your credentials
// ✅ CORRECT - in all your model files
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { require: true }  // Required for TiDB Cloud
});

export const getEmployee_db = async () => {
    const [rows] = await pool.query('SELECT * FROM employeeInformation;');
    return rows;
};

//  Get total employees
export const getTotalEmployees_db = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM employeeInformation;');
    return rows[0].total;
};

// Add a new employee
export const postEmployee_db = async (
    employeeId,
    name,
    position,
    department,
    salary,
    employmentHistory,
    contact,
    image
) => {
    const query = `
        INSERT INTO employeeInformation
        (employeeId, name, position, department, salary, employmentHistory, contact, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
        employeeId,
        name,
        position,
        department,
        salary,
        employmentHistory,
        contact,
        image
    ]);
};
