<script setup>
import { ref, onMounted } from 'vue'
import NavBar from "@/components/NavBar.vue"

const employees = ref([])

// 🔹 Get employee image from local assets, fallback to default.png
const getImage = (fileName) => {
  if (!fileName) return new URL('../assets/employees/default.png', import.meta.url).href
  try {
    return new URL(`../assets/employees/${fileName}`, import.meta.url).href
  } catch {
    return new URL('../assets/employees/default.png', import.meta.url).href
  }
}

// 🔹 Fetch employees from backend
onMounted(async () => {
  try {
    const res = await fetch('https://group-12-repo.onrender.com/employee')
    if (!res.ok) throw new Error(res.statusText)

    const data = await res.json()
    employees.value = data
  } catch (err) {
    console.error('Failed to load employees from MySQL', err)
  }
})
</script>

<template>
  <NavBar />

  <div class="container">
    <h5 class="page-title">Employee Information</h5>

    <!-- Loading message -->
    <div v-if="employees.length === 0" class="no-data">
      Loading employees from database...
    </div>

    <!-- Employee cards -->
    <div class="employees-row" v-else>
      <div
        v-for="employee in employees"
        :key="employee.employeeId"
        class="employee-card"
      >
        <img
          :src="getImage(employee.image)"
          class="card-img-top"
          :alt="`Photo of ${employee.name}`"
        />

        <div class="card-body">
          <p class="name"><strong>{{ employee.name }}</strong></p>
          <p class="position"><strong>Position:</strong> {{ employee.position }}</p>
          <p class="department"><strong>Department:</strong> {{ employee.department }}</p>
          <p class="salary"><strong>Salary:</strong> R {{ employee.salary }}</p>
          <p class="employmentHistory"><strong>History:</strong> {{ employee.employmentHistory }}</p>
          <p class="contact"><strong>Contact:</strong> {{ employee.contact }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 100%;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
  color: #333;
}

.employees-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
  align-items: flex-start;
}

.employee-card {
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.employee-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-img-top {
  height: 220px;
  object-fit: cover;
  object-position: top;
}

.card-body {
  background-color: #f8f9fa;
  padding: 15px;
  display: block;
}

.name {
  font-size: 1.1rem;
  margin: 8px 0;
  color: #222;
}

.position, .department, .salary, .employmentHistory, .contact {
  font-size: 0.85rem;
  margin: 6px 0;
  color: #555;
}

.no-data {
  text-align: center;
  margin: 40px 0;
  color: #888;
  font-size: 1rem;
}
</style>
