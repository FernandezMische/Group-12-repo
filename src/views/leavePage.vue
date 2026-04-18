<script setup>
import { ref, onMounted, computed } from "vue";
import NavBar from "@/components/NavBar.vue";

const leaveRequests = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const pendingRequests = computed(() => {
  return leaveRequests.value
    .map(emp => ({
      ...emp,
      requests: emp.requests.filter(req => String(req.leaveStatus).toLowerCase() === 'pending')
    }))
    .filter(emp => emp.requests.length > 0);
});

const getStatusClass = (status) => {
  if (!status) return '';
  const str = String(status).toLowerCase();
  if (str === 'pending') return 'status-pending';
  if (str === 'approved') return 'status-approved';
  if (str === 'denied') return 'status-denied';
  return 'status-other';
}

// Approve leave request
const approveRequest = async (emp, req) => {
  try {
    const res = await fetch(`https://group-12-repo.onrender.com/leave/${req.leaveRequests_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaveStatus: 'Approved' })
    });
    if (!res.ok) throw new Error('Failed to approve');
    req.leaveStatus = 'Approved'; 
  } catch (err) {
    console.error(err);
  }
}

//  Deny leave request
const denyRequest = async (emp, req) => {
  try {
    const res = await fetch(`https://group-12-repo.onrender.com/leave/${req.leaveRequests_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaveStatus: 'Denied' })
    });
    if (!res.ok) throw new Error('Failed to deny');
    req.leaveStatus = 'Denied'; 
  } catch (err) {
    console.error(err);
  }
}

//  Fetch leave requests 
onMounted(async () => {
  try {
    const res = await fetch('https://group-12-repo.onrender.com/leave');
    if (!res.ok) throw new Error('Failed to fetch leave requests');
    const data = await res.json();

    // Groups request by employees
    const grouped = {};
    data.Leave.forEach(lr => {
      if (!grouped[lr.employeeId]) {
        grouped[lr.employeeId] = { name: lr.employeeName || `Employee ${lr.employeeId}`, requests: [] };
      }
      grouped[lr.employeeId].requests.push(lr);
    });
    leaveRequests.value = Object.values(grouped);
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <NavBar />

  <div class="card-body">
    <h5 class="card-title">Time Off Overview</h5>
    <div class="container text-center mb-3">
      <div class="row">
        <div class="col">Total Requests: {{ leaveRequests.reduce((acc, e) => acc + e.requests.length, 0) }}</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Pending requests:</h5>
      <table class="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="emp in pendingRequests" :key="emp.name">
            <tr v-for="(req, index) in emp.requests" :key="req.leaveRequests_ID">
              <td v-if="index === 0" :rowspan="emp.requests.length"><strong>{{ emp.name }}</strong></td>
              <td>{{ formatDate(req.leaveDate) }}</td>
              <td>{{ req.reason }}</td>
              <td><span class="status-badge" :class="getStatusClass(req.leaveStatus)">{{ req.leaveStatus }}</span></td>
              <td>
                <button class="btn btn-success btn-sm me-2" @click="approveRequest(emp, req)">Approve</button>
                <button class="btn btn-danger btn-sm" @click="denyRequest(emp, req)">Deny</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <h5 class="card-title">All Time-off requests:</h5>
      <table class="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="emp in leaveRequests" :key="emp.name">
            <tr v-for="(req, index) in emp.requests" :key="req.leaveRequests_ID">
              <td v-if="index === 0" :rowspan="emp.requests.length"><strong>{{ emp.name }}</strong></td>
              <td>{{ formatDate(req.leaveDate) }}</td>
              <td>{{ req.reason }}</td>
              <td><span class="status-badge" :class="getStatusClass(req.leaveStatus)">{{ req.leaveStatus }}</span></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

:root { --card-bg: #f5fbff; --accent: #0034de; --muted: #8d8d8d; --radius: 10px; --success: #4caf50; --danger: #f44336; --warning: #ff9800; }
.page-card, .card-body { background: var(--card-bg); max-width: 960px; margin: 24px auto; padding: 20px 24px; border-radius: var(--radius); box-shadow: 0 6px 18px rgba(3, 20, 80, 0.06); }
.card { max-width: 960px; margin: 24px auto; padding: 20px 24px; background: #fff; border-radius: var(--radius); box-shadow: 0 6px 18px rgba(3, 20, 80, 0.06); }
.card-title { margin: 0 0 20px 0; font-size: 1.25rem; color: #0b234b; font-weight: 700; }
.container { max-width: 960px; margin: 12px auto; }
.text-center { text-align: center; }
.mb-3 { margin-bottom: 1rem; }
.row { display: flex; justify-content: center; }
.col { font-size: 1.1rem; color: #0b234b; font-weight: 600; }
.table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.table thead { background: #f5f5f5; }
.table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
.table th { font-weight: 600; color: var(--muted); font-size: 0.9rem; text-transform: uppercase; }
.table tbody tr:hover { background: #fafafa; }
.status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.status-pending { background: #fff3e0; color: #e65100; }
.status-approved { background: #e8f5e9; color: #2e7d32; }
.status-denied { background: #ffebee; color: #c62828; }
.status-other { background: #f5f5f5; color: #666; }
.btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: opacity 0.2s; }
.btn:hover { opacity: 0.8; }
.btn-success { background: #4caf50; color: white; }
.btn-danger { background: #f44336; color: white; }
.btn-sm { padding: 4px 10px; font-size: 0.8rem; }
.me-2 { margin-right: 8px; }
@media (max-width: 640px) { .table { font-size: 0.85rem; } .table th, .table td { padding: 8px; } .status-badge { padding: 4px 10px; font-size: 0.8rem; } }
</style>
