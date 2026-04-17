<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
import API_BASE_URL from '../config/api.js';
const people = ref([]);
const totalEmployees = ref(0);
const totalAttendanceRecordings = ref(0);
const filterStatus = ref("all");

const filteredAttendance = computed(() => {
  if (filterStatus.value === "all") return people.value;
  return people.value
    .map(emp => ({ ...emp, attendance: emp.attendance.filter(rec => rec.status.toLowerCase() === filterStatus.value) }))
    .filter(emp => emp.attendance.length > 0);
});

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/attendance`);  // ← CHANGED
    const grouped = {};
    res.data.forEach(record => {
      if (!grouped[record.employeeId]) {
        grouped[record.employeeId] = { employeeId: record.employeeId, name: record.employeeName, attendance: [] };
      }
      grouped[record.employeeId].attendance.push({ date: record.attendanceDate, status: record.status });
    });
    people.value = Object.values(grouped);
    totalEmployees.value = people.value.length;
    totalAttendanceRecordings.value = people.value.reduce((sum, emp) => sum + emp.attendance.length, 0);
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
<!-- Template stays the same -->
