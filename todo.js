const apiUrl = 'http://localhost:3000/users';
const userModal = document.getElementById('userModal');
const modalForm = document.getElementById('modalForm');
const userList = document.getElementById('userList');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const addUserBtn = document.getElementById('addUserBtn');
const closeModalBtn = document.getElementById('closeModal');

let users = [];
let editingUserId = null;

addUserBtn.addEventListener('click', () => {
    editingUserId = null;
    modalForm.reset();
    userModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    userModal.classList.add('hidden');
});

modalForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const user = {
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        age: parseInt(document.getElementById('age').value, 10),
        color: document.getElementById('color').value,
    };

    if (editingUserId) {
        await updateUser(editingUserId, user);
    } else {
        await addUser(user);
    }

    userModal.classList.add('hidden');
    fetchUsers();
});

async function fetchUsers() {
    const response = await fetch(apiUrl);
    users = await response.json();
    renderUsers();
}

async function addUser(user) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

async function updateUser(id, user) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

async function deleteUser(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    fetchUsers();
}

function renderUsers() {
    const filteredUsers = users
        .filter(user => 
            user.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            user.surname.toLowerCase().includes(searchInput.value.toLowerCase())
        )
        .sort((a, b) => {
            if (sortSelect.value === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortSelect.value === 'age') {
                return a.age - b.age;
            }
        });

    userList.innerHTML = '';

    filteredUsers.forEach(user => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 bg-gray-100 rounded';
        li.innerHTML = `
            <span>${user.name} ${user.surname}, Age: ${user.age}, Favorite Color: <span style="background-color: ${user.color}; width: 16px; height: 16px; display: inline-block;"></span></span>
            <div class="space-x-2">
                <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onclick="editUser(${user.id})">Edit</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        userList.appendChild(li);
    });
}

function editUser(id) {
    const user = users.find(user => user.id == id);
    if (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('surname').value = user.surname;
        document.getElementById('age').value = user.age;
        document.getElementById('color').value = user.color;
        editingUserId = id;
        userModal.classList.remove('hidden');
    }

}

searchInput.addEventListener('input', renderUsers);

sortSelect.addEventListener('change', renderUsers);

fetchUsers();
