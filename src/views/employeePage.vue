<script setup>
import { ref, onMounted } from 'vue'
import NavBar from "@/components/NavBar.vue"
import API_BASE_URL from '@/config/api.js'  // ← ADD THIS

const employees = ref([])

const getImage = (fileName) => {
  if (!fileName) return new URL('../assets/employees/default.png', import.meta.url).href
  try {
    return new URL(`../assets/employees/${fileName}`, import.meta.url).href
  } catch {
    return new URL('../assets/employees/default.png', import.meta.url).href
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/employee`)  // ← CHANGED
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    employees.value = data
  } catch (err) {
    console.error('Failed to load employees from MySQL', err)
  }
})
</script>
<!-- Rest of template stays the same -->
