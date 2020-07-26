function updateHtml(ranks) {
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  ranks.forEach((e, i) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <th scope="row">${i + 1}</th>
      <td> ${e.user_name}</td>
      <td>${e.score}</td>`;
    tbody.appendChild(tr);
  });
}

function getUsers() {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", "http://localhost:3000/");
  xhr.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status) {
      let result = await JSON.parse(xhr.responseText);
      console.log(result);
      if (this.status == 200) updateHtml(result["result"]);
    }
  };
  xhr.send();
}

function updateUser() {
  let user_name = document.getElementById("userName").value;
  let new_score = document.getElementById("score").value;
  if (!user_name || !new_score) return;

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://localhost:3000/updateUser");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status) {
      let result = await JSON.parse(xhr.responseText);
      console.log(result);
    }
  };

  let body = {
    user_name,
    new_score: parseInt(new_score),
  };
  xhr.send(JSON.stringify(body));
}
