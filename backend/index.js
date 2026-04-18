import express from 'express';
import cors from 'cors';

// Employee controllers
import {
    getEmployees,
    getTotalEmployees
} from './controllers/employeeController.js';

// Attendance controller functions
import { getAttendance } from './controllers/attendanceController.js';

// Leave controllers
import { getLeave, patchLeave, postLeave, deleteLeave } from './controllers/leaveController.js';

// Payroll controller functions
import { getPayroll, postPayroll, patchPayroll, deletePayroll } from './controllers/payrollController.js';
import { postLeaveApplication } from './controllers/applicationController.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:2006',
    'https://hr-app-final.vercel.app'  // ← ADD THIS NEW URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Employee routes
app.get('/employee', getEmployees);
app.get('/employee/total', getTotalEmployees);

// Attendance routes
app.get('/attendance', getAttendance);

// Leave routes
app.get('/leave', getLeave);
app.post('/leave', postLeave);
app.patch('/leave/:leaveRequests_ID', patchLeave);
app.delete('/leave', deleteLeave);

// Payroll routes
app.get('/payroll', getPayroll);
app.post('/payroll', postPayroll);
app.patch('/payroll/:payroll_id', patchPayroll);
app.delete('/payroll/:payroll_id', deletePayroll);

// Leave application route
app.post('/application/leave', postLeaveApplication);

// Start server - FIXED FOR RENDER
const PORT = process.env.PORT || 2006;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
