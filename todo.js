let modal = document.getElementById("modal");
modal.style.display = "none";
let form = {};
let baseUrl = "http://localhost:8000/prodact";
let editingItemId = null;

function openModal() {
  if (modal.style.display === "none") {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
}

async function saveForm(event) {
  let { name, value } = event.target;
  form = { ...form, [name]: value };
  console.log(name, value);
}

document.getElementById("save").addEventListener("click", async function (evn) {
  evn.preventDefault();
  const url = editingItemId ? `${baseUrl}/${editingItemId}` : baseUrl;
  const method = editingItemId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      editingItemId = null;
      getData();
    });
});

async function getData() {
  const response = await fetch(baseUrl);
  const data = await response.json();
  if (response.status === 200) {
    console.log(data);
    displayAdd(data);
  } else {
    alert("Error");
  }
}
getData();

function displayAdd(data) {
  tbody.innerHTML = "";
  console.log(data);
  data.forEach((item, index) => {
    console.log(item);
    tbody.innerHTML += `
      <tr>
        <th scope="col">${index + 1}</th>
        <td scope="col">${item.name}</td>
        <td scope="col">${item.price}</td>
        <td scope="col">${item.seria}</td>
        <td scope="col">${item.select}</td>
        <td scope="col">${item.color}</td>
        <td>
          <button id="${item.id}" onclick="editFunc('${item.id}')" class="edit btn btn-success">
            Edit
          </button>
          <button id="${item.id}" class="delete btn btn-danger">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

tbody.addEventListener("click", (evt) => {
  evt.preventDefault();
  if (evt.target.matches(".delete")) {
    let id = evt.target.id;
    fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => getData());
  }
});

async function editFunc(id) {
  try {
    const response = await fetch(`${baseUrl}/${id}`);
    const item = await response.json();
    editingItemId = id; 
    form = { ...item }; 
    document.querySelectorAll('#modal input').forEach(input => {
      input.value = item[input.name] || '';
    });
    openModal(); 
  } catch (error) {
    console.log(error);
  }
}
