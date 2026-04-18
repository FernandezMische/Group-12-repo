<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();


const employees = ref([]);

onMounted(async () => {
  try {
    const res = await fetch("https://group-12-repo.onrender.com/employee");
    if (res.ok) {
      employees.value = await res.json();
    }
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
    alert("Please fill in all required fields (Full Name, Entitlement, From, To, Reason)");
    return;
  }

  if (new Date(endDate) < new Date(startDate)) {
    alert("End date cannot be before start date");
    return;
  }

  try {
    const res = await fetch("https://group-12-repo.onrender.com/application/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        startDate,
        endDate,
        reason
      })
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


<template>
<NavBar />

<div class="container">
  <div class="heading">Leave Application</div>
 <!---- <form class="form" @submit="submitAttendanceForm">
    <div class="input-field">
      <label for="attendanceFullName">Full Name <span class="required">*</span></label>
      <input type="text" id="attendanceFullName" placeholder="Enter your full name" required>
    </div>

    <div class="input-field">
      <label for="attendanceStatus">Status <span class="required">*</span></label>
      <select id="attendanceStatus" required>
        <option>Select an option</option>
        <option>Present</option>
        <option>Absent</option>
      </select>
    </div>

    <div class="input-field">
      <label for="attendanceDate">Date <span class="required">*</span></label>
      <input type="date" id="attendanceDate" name="date" required>
    </div>

    <div class="btn-container">
      <button type="submit" class="btn">Submit</button>
    </div>
  </form>-->
</div>

<div class="container">

  <form class="form" @submit="submitLeaveForm">
    <div class="input-field">
      <label for="leaveFullName">Full Name <span class="required">*</span></label>
      <input type="text" id="leaveFullName" placeholder="Enter your full name" required>
    </div>

    <div class="input-field">
      <label for="leaveEntitlement">Entitlement <span class="required">*</span></label>
      <select id="leaveEntitlement" required>
        <option>Select an option</option>
        <option>Annual Leave</option>
        <option>Sick Leave</option>
        <option>Family Responsibility/Childcare</option>
      </select>
    </div>

    <div class="row">
      <div class="input-field">
        <label for="leave_start_date">From <span class="required">*</span></label>
        <input type="date" id="leave_start_date" name="start_date" required>
      </div>
      <div class="input-field">
        <label for="leave_end_date">To <span class="required">*</span></label>
        <input type="date" id="leave_end_date" name="end_date" required>
      </div>
    </div>

    <div class="input-field">
      <label for="leaveSession">Session</label>
      <select id="leaveSession">
        <option>Full Day</option>
        <option>Half Day (AM)</option>
        <option>Half Day (PM)</option>
      </select>
    </div>

    <div class="input-field">
      <label for="leaveAttachment">Attachment</label>
      <input type="file" id="leaveAttachment">
    </div>

    <div class="input-field">
      <label for="leaveReason">Reason <span class="required">*</span></label>
      <textarea id="leaveReason" maxlength="200" required></textarea>
    </div>

    <div class="btn-container">
      <button type="submit" class="btn">Submit</button>
    </div>
  </form>
</div>
</template>


<style scoped>

    :root {
  --card-bg: #f5fbff;
  --accent: #0034de;
  --muted: #8d8d8d;
  --radius: 10px;
}

.page-card,
.card-body {
  background: var(--card-bg);
  max-width: 760px;
  margin: 24px auto;
  padding: 20px 24px;
  border-radius: var(--radius);
  box-shadow: 0 6px 18px rgba(3, 20, 80, 0.06);
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 1.15rem;
  color: #0b234b;
}

.container {
  max-width: 760px;
  margin: 12px auto;
  padding: 18px;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  background: #fff;
}

.container .heading {
  font-size: 1.25rem;
  margin-bottom: 14px;
  font-weight: 700;
  color: #0b234b;
}


.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.row .input-field {
  flex: 1 1 220px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-field label {
  font-size: 0.92rem;
  color: var(--muted);
  margin-left: 4px;
  font-weight: 500;
}

.input-field input,
.input-field select,
.input-field textarea,
.input-field input[type="file"] {
  padding: 12px 14px;
  font-size: 0.98rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  color: #082344;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field textarea {
  min-height: 100px;
  resize: vertical;
}

.input-field input:focus,
.input-field select:focus,
.input-field textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 52, 222, 0.06);
}

.required { color: #d04545; }

.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 12px 32px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #0034de, #0a63ff);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 52, 222, 0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 52, 222, 0.3);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 52, 222, 0.2);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
}


.card .card-body {
  background: transparent;
  padding: 0;
  box-shadow: none;
}

ul { padding-left: 18px; }


@media (max-width: 640px) {
  .row { flex-direction: column; }
  .page-card,
  .container { margin: 12px; padding: 16px; }
  .btn-container { justify-content: center; margin-top: 20px; }
}
</style>
