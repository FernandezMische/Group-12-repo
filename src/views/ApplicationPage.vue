<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import API_BASE_URL from '@/config/api.js';  // ← ADD THIS

const router = useRouter();
const employees = ref([]);

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/employee`);  // ← CHANGED
    if (res.ok) employees.value = await res.json();
  } catch (err) {
    console.error("Failed to load employees:", err);
  }
});

const submitLeaveForm = async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("leaveFullName").value.trim();
  const entitlement = document.getElementById("leaveEntitlement").value;
  const startDate = document.getElementById("leave_start_date").value;
  const endDate = document.getElementById("leave_end_date").value;
  const reason = document.getElementById("leaveReason").value.trim();

  if (!fullName || entitlement === "Select an option" || !startDate || !endDate || !reason) {
    alert("Please fill in all required fields");
    return;
  }
  if (new Date(endDate) < new Date(startDate)) {
    alert("End date cannot be before start date");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/application/leave`, {  // ← CHANGED
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, startDate, endDate, reason })
    });
    if (!res.ok) throw new Error("Failed to submit leave request");
    alert("Leave request submitted successfully!");
    router.push("/leave");
  } catch (err) {
    console.error(err);
    alert("Submission failed");
  }
};
</script>
<!-- Template stays the same -->
