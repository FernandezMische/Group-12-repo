// Add this import at the top

import API_BASE_URL from '../config/api.js';
console.log('API_BASE_URL is:', API_BASE_URL);
`${API_BASE_URL}/leave`


const approveRequest = async (emp, req) => {
  try {
    const res = await fetch(`${API_BASE_URL}/leave/${req.leaveRequests_ID}`, {
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
