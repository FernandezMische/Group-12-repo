<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import API_BASE_URL from '@/config/api.js';  // ← ADD THIS

const payrolls = ref([]);

const formatZAR = (amount) => {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
};

const fetchPayroll = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/payroll`);  // ← CHANGED
    if (!res.ok) throw new Error('Failed to fetch payroll');
    payrolls.value = await res.json();
  } catch (err) {
    console.error(err.message);
  }
};

const printTable = () => { window.print(); };
const generatePayslip = () => { alert('PDF generation coming soon'); };

const printPayslip = (payroll) => {
  const payslipWindow = window.open('', '_blank');
  payslipWindow.document.write(`
    <html>
      <head><title>Payslip - ${payroll.employeeId}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .payslip { border: 2px solid #333; padding: 20px; max-width: 600px; }
        .header { text-align: center; margin-bottom: 30px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
        button { margin-top: 20px; padding: 10px 20px; }
        @media print { button { display: none; } }
      </style>
      </head>
      <body>
        <div class="payslip">
          <div class="header"><h1>Modern Tech Solutions</h1><h2>PAYSLIP</h2></div>
          <div class="row"><span>Employee ID:</span><span>${payroll.employeeId}</span></div>
          <div class="row"><span>Hours Worked:</span><span>${payroll.hoursWorked}</span></div>
          <div class="row"><span>Leave Deductions:</span><span>${payroll.leaveDeductions} hrs</span></div>
          <div class="row total"><span>NET PAY:</span><span>${formatZAR(payroll.finalSalary)}</span></div>
          <button onclick="window.print()">Print Payslip</button>
        </div>
      </body>
    </html>
  `);
  payslipWindow.document.close();
};

onMounted(fetchPayroll);
</script>
<!-- Template stays the same -->
