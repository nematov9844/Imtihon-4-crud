let tbody = document.querySelector("tbody");
let elText = document.querySelector(".name_inpt");
let elBtn = document.getElementById("btn");

let dataUrl = "https://test-api-kappa-ten.vercel.app/api/todo";

async function getData() {
  const response = await fetch(dataUrl);
  const { data, messenge } = await response.json();
  if (response.status === 200) {
    console.log(data, messenge);
    displayAdd(data);
  } else {
    alert("Error");
  }
}
getData();
function displayAdd(data) {
  tbody.innerHTML = "";
  data.forEach((item) => {
    tbody.innerHTML += `
    <tr>
    <td>${item.text}</td>
    <td>${item.createdAt}</td>
    <td> 
     <button  id="${item._id}"   class="delete open py-1 px-3 bg-red-500 rounded-[10px] text-white">
            Delete
     </button>
    </td>
    <td>  
      <button  id="${item._id}"   class="edit open py-1 px-3 bg-orange-500 rounded-[10px] text-white">
       Edit
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
    fetch(`${dataUrl}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => getData());
  }
  //edit
  if (evt.target.matches(".edit")) {
    let id = evt.target.id;
    fetch(`${dataUrl}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        text: elText.value
      }),
      headers:{
      "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => getData());
  }

});

elBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  fetch(dataUrl, {
    method: "POST",
    body: JSON.stringify({
      text: elText.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => getData());
});
