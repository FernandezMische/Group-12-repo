<template>
  <NavBar />

  <div class="container">
    <h1>Payroll Records</h1>

    <div class="mb-3">
      <button @click="printTable" class="btn btn-primary">
        Print Table
      </button>
      <button @click="generatePayslip" class="btn btn-success ms-2">
        Generate PDF
      </button>
    </div>

    <table id="payrollTable">
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Hours Worked</th>
          <th>Leave Deductions</th>
          <th>Final Salary</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="payroll in payrolls" :key="payroll.payroll_id">
          <td>{{ payroll.employeeId }}</td>
          <td>{{ payroll.hoursWorked }}</td>
          <td>{{ payroll.leaveDeductions }}</td>
          <td>{{ formatZAR(payroll.finalSalary) }}</td>
          <td>
            <button
              @click="printPayslip(payroll)"
              class="btn btn-sm btn-outline-primary"
            >
              Print Payslip
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';

const payrolls = ref([]);

// currency to South African Rand- cause we cant afford dollars
const formatZAR = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

const fetchPayroll = async () => {
  try {
    const res = await fetch('https://group-12-repo.onrender.com/payroll');
    if (!res.ok) throw new Error('Failed to fetch payroll');
    payrolls.value = await res.json();
  } catch (err) {
    console.error(err.message);
  }
};

const printTable = () => {
  window.print();
};

const generatePayslip = () => {
  alert('PDF generation coming soon');
};

const printPayslip = (payroll) => {
  const payslipWindow = window.open('', '_blank');

  payslipWindow.document.write(`
    <html>
      <head>
        <title>Payslip - ${payroll.employeeId}</title>
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
          <div class="header">
            <h1>Modern Tech Solutions</h1>
            <h2>PAYSLIP</h2>
          </div>

          <div class="row">
            <span>Employee ID:</span>
            <span>${payroll.employeeId}</span>
          </div>

          <div class="row">
            <span>Hours Worked:</span>
            <span>${payroll.hoursWorked}</span>
          </div>

          <div class="row">
            <span>Leave Deductions:</span>
            <span>${payroll.leaveDeductions} hrs</span>
          </div>

          <div class="row total">
            <span>NET PAY:</span>
            <span>${formatZAR(payroll.finalSalary)}</span>
          </div>

          <button onclick="window.print()">Print Payslip</button>
        </div>
      </body>
    </html>
  `);

  payslipWindow.document.close();
};

onMounted(fetchPayroll);
</script>

<style scoped>
.container {
  margin-top: 80px;
  padding: 20px;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  background-color: white; 
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  background-color: white; 
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}


tr:hover {
  background-color: #f8f9fa; 
}


tbody tr {
  background-color: white;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-outline-primary {
  background-color: white;
  color: #007bff;
  border: 1px solid #007bff;
}
.ms-2 {
  margin-left: 8px;
}

.mb-3 {
  margin-bottom: 16px;
}

@media print {
  .btn {
    display: none;
  }
  
  th, td {
    background-color: white !important;
  }
  
  tbody tr {
    background-color: white !important;
  }
}
</style>
