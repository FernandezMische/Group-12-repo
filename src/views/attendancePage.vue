<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NavBar from "@/components/NavBar.vue";


const people = ref([]);
const totalEmployees = ref(0);
const totalAttendanceRecordings = ref(0);
const filterStatus = ref("all");

const filteredAttendance = computed(() => {
  if (filterStatus.value === "all") {
    return people.value;
  }

  return people.value
    .map(emp => ({
      ...emp,
      attendance: emp.attendance.filter(
        rec => rec.status.toLowerCase() === filterStatus.value
      )
    }))
    .filter(emp => emp.attendance.length > 0);
});

onMounted(async () => {
  try {
    const res = await axios.get("https://group-12-repo.onrender.com/attendance");

    const grouped = {};

    res.data.forEach(record => {
      if (!grouped[record.employeeId]) {
        grouped[record.employeeId] = {
          employeeId: record.employeeId,
          name: record.employeeName,
          attendance: []
        };
      }

      grouped[record.employeeId].attendance.push({
        date: record.attendanceDate,
        status: record.status
      });
    });

    people.value = Object.values(grouped);

    totalEmployees.value = people.value.length;
    totalAttendanceRecordings.value = people.value.reduce(
      (sum, emp) => sum + emp.attendance.length,
      0
    );
  } catch (err) {
    console.error("Attendance fetch failed:", err);
  }
});

const formatDate = (d) => new Date(d).toLocaleDateString();

const statusClass = (s) => {
  const v = s.toLowerCase();
  if (v === "present") return "status-present";
  if (v === "absent") return "status-absent";
  return "status-other";
};
</script>

<template>
  <NavBar />

  <div id="outerCard" class="card-body">
    <h5 class="card-title">Attendance Overview</h5>

    <div class="container text-center mb-3">
      <div class="row">
        <div class="col">Employees: {{ totalEmployees }}</div>
        <div class="col">
          Attendance Recordings: {{ totalAttendanceRecordings }}
        </div>
      </div>
    </div>

    <div class="filters">
      <button @click="filterStatus = 'absent'" :class="{ active: filterStatus === 'absent' }">
        Absent
      </button>
      <button @click="filterStatus = 'present'" :class="{ active: filterStatus === 'present' }">
        Present
      </button>
      <button @click="filterStatus = 'all'" :class="{ active: filterStatus === 'all' }">
        All
      </button>
    </div>

    <div class="card mt-3">
      <div id="attendanceCard" class="card-body">
        <h5 class="card-title">Attendance Records</h5>

        <div v-if="people.length === 0" class="text-center">
          No attendance data found.
        </div>

        <div v-else>
          <div
            v-for="emp in filteredAttendance"
            :key="emp.employeeId"
            class="mb-4"
          >
            <h6 style="background:#f7f9fb;padding:10px;border-radius:6px">
              <strong>{{ emp.name }}</strong>
              <small class="text-muted">(#{{ emp.employeeId }})</small>
            </h6>

            <table class="table table-sm table-bordered mt-2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="rec in emp.attendance"
                  :key="rec.date"
                  :class="statusClass(rec.status)"
                >
                  <td>{{ formatDate(rec.date) }}</td>
                  <td>{{ rec.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
#outerCard {
  background-color: aliceblue;
  width: 800px;
  padding: 15px;
  margin: 5% auto;
  border-radius: 10px;
}

.status-present td {
  background: #d4edda;
  color: #155724;
}
.status-absent td {
  background: #f8d7da;
  color: #721c24;
}
.status-other td {
  background: #eef2f5;
}

.filters {
  margin-top: 15px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.filters button.active {
  background: #1b263b;
  color: white;
}
</style>
