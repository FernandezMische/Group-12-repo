<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NavBar from "@/components/NavBar.vue"
import API_BASE_URL from '@/config/api.js'  // ← ADD THIS

const totalEmployees = ref(0)
const totalLeaveRequests = ref(0)
const performanceList = ref([])
const calendarMonth = ref(new Date())
const monthDays = ref([])

const fetchTotalEmployees = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/employee/total`)  // ← CHANGED
    totalEmployees.value = res.data.total
  } catch (err) { console.error(err) }
}

const fetchLeaves = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/leave`)  // ← CHANGED
    const leaves = res.data.Leave
    totalLeaveRequests.value = leaves.length
    const year = calendarMonth.value.getFullYear()
    const month = calendarMonth.value.getMonth()
    const monthLeaves = leaves.filter(l => {
      const d = new Date(l.leaveDate)
      return d.getFullYear() === year && d.getMonth() === month
    })
    generateCalendar(monthLeaves)
  } catch (err) { console.error(err) }
}

const fetchTopAttendance = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/attendance`)  // ← CHANGED
    const attendanceData = res.data
    const attendanceMap = {}
    attendanceData.forEach(record => {
      const { employeeId, status } = record
      if (!attendanceMap[employeeId]) attendanceMap[employeeId] = { name: record.name, present: 0, total: 0 }
      attendanceMap[employeeId].total += 1
      if (status.toLowerCase() === 'present') attendanceMap[employeeId].present += 1
    })
    performanceList.value = Object.values(attendanceMap)
      .map(emp => ({ name: emp.name, attendanceRate: emp.total > 0 ? Math.round((emp.present / emp.total) * 100) : 0 }))
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
      .slice(0, 5)
  } catch (err) { console.error(err) }
}

const generateCalendar = (leaves) => {
  const year = calendarMonth.value.getFullYear()
  const month = calendarMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const dayLeaves = leaves.filter(l => {
      const leaveDate = new Date(l.leaveDate)
      return leaveDate.getFullYear() === date.getFullYear() &&
             leaveDate.getMonth() === date.getMonth() &&
             leaveDate.getDate() === date.getDate()
    })
    days.push({ date, leaves: dayLeaves })
  }
  const offset = firstDay.getDay()
  for (let i = 0; i < offset; i++) days.unshift({ date: null, leaves: [] })
  monthDays.value = days
}

const isToday = (day) => {
  if (!day.date) return false
  const today = new Date()
  return day.date.toDateString() === today.toDateString()
}

const prevMonth = () => {
  calendarMonth.value.setMonth(calendarMonth.value.getMonth() - 1)
  fetchLeaves()
}

const nextMonth = () => {
  calendarMonth.value.setMonth(calendarMonth.value.getMonth() + 1)
  fetchLeaves()
}

onMounted(() => {
  fetchTotalEmployees()
  fetchLeaves()
  fetchTopAttendance()
})
</script>
<!-- Template stays the same -->
