async function saveMessage() {
  const message = document.getElementById("msg").value.trim();
  const box = document.getElementById("coordsBox");

  if (!message) {
    box.style.display = "block";
    box.textContent = "Please enter a message before saving.";
    return;
  }

  const res = await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  box.style.display = "block";
  box.innerHTML =
    `Message saved successfully.<br><br><b>Share these coordinates:</b><br>X = ${data.x}<br>Y = ${data.y}`;
}

async function findMessage() {
  const x = document.getElementById("x").value.trim();
  const y = document.getElementById("y").value.trim();
  const box = document.getElementById("resultBox");

  if (!x || !y) {
    box.style.display = "block";
    box.textContent = "Please enter both coordinates.";
    return;
  }

  const res = await fetch("/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x, y })
  });

  const data = await res.json();
  box.style.display = "block";
  box.textContent = data.found
    ? data.message
    : "No message found for these coordinates.";
}