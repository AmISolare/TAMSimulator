let subjectCount = 0;
let currentSubject = null;

function addCustomSubject() {
  const subjectName = prompt("Enter the name of the new subject:");
  if (!subjectName) return;

  subjectCount++;
  const subjectId = `subject-${subjectCount}`;

  // Add button in sidebar
  const button = document.createElement("button");
  button.textContent = subjectName;
  button.onclick = () => showTab(subjectId);
  button.id = `btn-${subjectId}`;
  button.className = "subject-button"; // Apply subject-specific style
  document.getElementById("subject-buttons").appendChild(button);

  // Add subject content
  const container = document.getElementById("subjects-container");
  const subjectDiv = document.createElement("div");
  subjectDiv.id = subjectId;
  subjectDiv.className = "subject hidden";
  subjectDiv.innerHTML = `
    <h3>${subjectName}</h3>
    <div id="${subjectId}-fields"></div>
    <button onclick="addScoreField('${subjectId}')">Add Score</button>
    <button onclick="removeScoreField('${subjectId}')">Remove Score</button>
    <input type="number" id="${subjectId}-culminating" placeholder="Culminating Score" oninput="updateAverage('${subjectId}')">
    <input type="number" id="${subjectId}-culminating-percent" placeholder="Culminating %" oninput="updateAverage('${subjectId}')">
    <input type="number" id="${subjectId}-final" placeholder="Final Exam Score" oninput="updateAverage('${subjectId}')">
    <input type="number" id="${subjectId}-final-percent" placeholder="Final Exam %" oninput="updateAverage('${subjectId}')">
    <div id="${subjectId}-average" class="average">Average: 0.00</div>
  `;
  container.appendChild(subjectDiv);

  if (!currentSubject) showTab(subjectId); // Show the first subject automatically
}

function removeCustomSubject() {
  if (!currentSubject) {
    alert("No subject to remove.");
    return;
  }

  // Remove button and content
  document.getElementById(`btn-${currentSubject}`).remove();
  document.getElementById(currentSubject).remove();

  currentSubject = null;

  // Hide the content area
  const subjectsContainer = document.getElementById("subjects-container");
  subjectsContainer.querySelectorAll(".subject").forEach((subject) => subject.classList.add("hidden"));
}

function showTab(subjectId) {
  currentSubject = subjectId;

  // Hide all other subjects
  const subjectsContainer = document.getElementById("subjects-container");
  subjectsContainer.querySelectorAll(".subject").forEach((subject) => subject.classList.add("hidden"));

  // Show the selected subject
  document.getElementById(subjectId).classList.remove("hidden");

  // Hide info if shown
  document.getElementById("info").classList.add("hidden");
}

function addScoreField(subjectId) {
  const fieldsContainer = document.getElementById(`${subjectId}-fields`);
  const newField = document.createElement("input");
  newField.type = "number";
  newField.placeholder = `Score ${fieldsContainer.children.length + 1}`;
  newField.oninput = () => updateAverage(subjectId);
  fieldsContainer.appendChild(newField);
}

function removeScoreField(subjectId) {
  const fieldsContainer = document.getElementById(`${subjectId}-fields`);
  if (fieldsContainer.children.length > 0) {
    fieldsContainer.removeChild(fieldsContainer.lastChild);
  }
}

function updateAverage(subjectId) {
  const fieldsContainer = document.getElementById(`${subjectId}-fields`);
  const scores = Array.from(fieldsContainer.children)
    .map((input) => parseFloat(input.value))
    .filter((score) => !isNaN(score));

  const culminating = parseFloat(document.getElementById(`${subjectId}-culminating`).value) || 0;
  const culminatingPercent = parseFloat(document.getElementById(`${subjectId}-culminating-percent`).value) || 0;

  const finalExam = parseFloat(document.getElementById(`${subjectId}-final`).value) || 0;
  const finalExamPercent = parseFloat(document.getElementById(`${subjectId}-final-percent`).value) || 0;

  const totalPercent = culminatingPercent + finalExamPercent;
  const regularPercent = 100 - totalPercent;

  if (regularPercent < 0) {
    document.getElementById(`${subjectId}-average`).textContent = "Error: Percentages exceed 100!";
    return;
  }

  const regularAverage = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const average =
    (regularAverage * (regularPercent / 100)) +
    (culminating * (culminatingPercent / 100)) +
    (finalExam * (finalExamPercent / 100));

  document.getElementById(`${subjectId}-average`).textContent = `Average: ${average.toFixed(2)}`;
}

function showInfo() {
  const info = document.getElementById("info");
  info.classList.toggle("hidden");
}
