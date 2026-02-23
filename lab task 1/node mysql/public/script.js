// script.js
// Frontend logic using fetch() to interact with the API

// Hold current edit id (null when adding)
let currentEditId = null;

const form = document.getElementById('user-form');
const userIdInput = document.getElementById('user_id');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tbody = document.getElementById('users-table-body');

// Load users on page load
window.addEventListener('DOMContentLoaded', loadUsers);

// Handle form submit for add/update
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    user_id: userIdInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  };

  try {
    if (currentEditId) {
      // Update existing
      await fetch(`/users/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new
      await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    resetForm();
    loadUsers();
  } catch (err) {
    console.error('Error saving user', err);
  }
});

// Cancel button resets the form
cancelBtn.addEventListener('click', (e) => {
  resetForm();
});

// Fetch and display all users
async function loadUsers() {
  try {
    const res = await fetch('/users');
    const users = await res.json();
    renderTable(users);
  } catch (err) {
    console.error('Error loading users', err);
  }
}

// Render table rows
function renderTable(users) {
  tbody.innerHTML = '';
  users.forEach((u) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${escapeHtml(u.user_id)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.phone)}</td>
      <td class="actions">
        <button data-id="${u.id}" class="edit">Edit</button>
        <button data-id="${u.id}" class="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach event listeners for edit/delete
  document.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => editUser(btn.dataset.id));
  });
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => deleteUser(btn.dataset.id));
  });
}

// Fill form with user data for editing
async function editUser(id) {
  try {
    const res = await fetch(`/users/${id}`);
    if (!res.ok) return alert('User not found');
    const u = await res.json();
    currentEditId = id;
    userIdInput.value = u.user_id;
    emailInput.value = u.email;
    phoneInput.value = u.phone;
    submitBtn.textContent = 'Update';
  } catch (err) {
    console.error('Error fetching user', err);
  }
}

// Delete user
async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  try {
    await fetch(`/users/${id}`, { method: 'DELETE' });
    loadUsers();
  } catch (err) {
    console.error('Error deleting user', err);
  }
}

// Reset form to add mode
function resetForm() {
  currentEditId = null;
  form.reset();
  submitBtn.textContent = 'Add';
}

// Simple escaping for output
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
