<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NavBar from "@/components/NavBar.vue"


const totalEmployees = ref(0)
const totalLeaveRequests = ref(0)
const performanceList = ref([])

const calendarMonth = ref(new Date())
const monthDays = ref([]) // days with leaves


const fetchTotalEmployees = async () => {
  try {
    const res = await axios.get('https://group-12-repo.onrender.com/employee/total')
    totalEmployees.value = res.data.total
  } catch (err) { console.error(err) }
}


const fetchLeaves = async () => {
  try {
    const res = await axios.get('https://group-12-repo.onrender.com/leave')
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
    const res = await axios.get('https://group-12-repo.onrender.com/attendance')
    const attendanceData = res.data

    const attendanceMap = {}
    attendanceData.forEach(record => {
      const { employeeId, status } = record
      if (!attendanceMap[employeeId]) attendanceMap[employeeId] = { name: record.name, present: 0, total: 0 }
      attendanceMap[employeeId].total += 1
      if (status.toLowerCase() === 'present') attendanceMap[employeeId].present += 1
    })

    performanceList.value = Object.values(attendanceMap)
      .map(emp => ({
        name: emp.name,
        attendanceRate: emp.total > 0 ? Math.round((emp.present / emp.total) * 100) : 0
      }))
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

<template>
  <NavBar/>
  <div class="containerBox d-flex justify-content-center gap-5">

    <div class="sideBoxes">

     
      <div class="card mb-3" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Employees</h5>
          <p class="card-text">Total: {{ totalEmployees }}</p>
          <router-link to="/employee" class="btn btn-primary">Go</router-link>
        </div>
      </div>

    
      <div class="card text-center mb-3" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Leave requests</h5>
          <p class="card-text">Requests: {{ totalLeaveRequests }}</p>
          <router-link to="/leave" class="btn btn-primary">Go</router-link>
        </div>
      </div>

      <!-- Top Attendance -->
      <div class="card mb-3" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Top Attendance</h5>
          <ul class="perf-list list-unstyled mb-0">
            <li v-for="p in performanceList" :key="p.name" class="perf-item">
              <div class="perf-row">
                <div class="perf-name">{{ p.name }}</div>
                <div class="perf-rate">{{ p.attendanceRate }}%</div>
              </div>
              <div class="perf-bar">
                <div class="perf-fill" :style="{ width: p.attendanceRate + '%' }"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="calendar-wrapper w-50">
      <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-sm btn-outline-light" @click="prevMonth">&lt;</button>
        <h3 class="text-center mb-0">{{ calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' }) }}</h3>
        <button class="btn btn-sm btn-outline-light" @click="nextMonth">&gt;</button>
      </div>

      <ul class="calendar-weekdays list-unstyled d-flex justify-content-between mb-2">
        <li v-for="day in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="day" class="text-center w-14">{{ day }}</li>
      </ul>

      <ul class="calendar-grid">
        <li v-for="(day, index) in monthDays" :key="index" :class="{ empty: !day.date }">
          <time v-if="day.date" :class="{ today: isToday(day) }">{{ day.date.getDate() }}</time>
          <ul v-if="day.date && day.leaves.length">
            <li v-for="leave in day.leaves" :key="leave.leaveRequest_ID">
              <span>{{ leave.employeeId }} - {{ leave.reason }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
.containerBox {
  display: flex;
  gap: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
}
.sideBoxes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 280px;
}

/* Performance list */
.perf-item {
   margin-bottom: 12px;
   }
.perf-row { 
  display: flex;
   justify-content: space-between;
    margin-bottom: 4px; 
    font-size: 14px; 
  }
.perf-name { 
  font-weight: 500;
 }
.perf-rate {
   color: #666; 
   font-weight: 600;
}
.perf-bar {
   height: 8px; 
   background-color: #e0e0e0;
    border-radius: 4px; 
    overflow: hidden;
  }
  
.perf-fill { 
  height: 100%; 
  background-color: #4CAF50;
   transition: width 0.3s ease;
   }

/* Calendar */
.calendar-wrapper { 
  background-color: #a360f5; 
  padding: 20px;
   border-radius: 10px;
    color: black;
     width: 100%;
     }

.calendar-header button {
   cursor: pointer;
   }

.calendar-weekdays li { 
  font-weight: 600;
   font-size: 14px;
    text-align: center;
   }

.calendar-grid { 
  display: grid;
   grid-template-columns: repeat(7, 1fr);
    gap: 10px;
     list-style: none; 
     padding: 0;
     }

.calendar-grid > li {
   background: white;
   border-radius: 10px;
    padding: 10px;
     min-height: 100px;
      display: flex;
       flex-direction: column;
        font-size: 14px;
         word-break: break-word;
         }

.calendar-grid > li.empty { 
  background: transparent;
   box-shadow: none;
   }

.calendar-grid time { font-weight: 700;
   font-size: 16px; 
   margin-bottom: 6px; 
  }

.calendar-grid time.today { color: #d6336c;
   border-bottom: 2px solid #d6336c;
   padding-bottom: 2px; 
}

.calendar-grid > li > ul { list-style-type: disc;
   padding-left: 18px;
    margin: 0;
   }


.calendar-grid > li > ul > li {
   background: none;
    padding: 0; 
    font-size: 13px;
    margin-bottom: 4px; 
}
</style>
