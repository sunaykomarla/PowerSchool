let assignments = [];

let courseTitleEl = document.querySelector("#content-main > div.box-round > table > tbody > tr:nth-child(2) > td:nth-child(1)");
let courseTitle = "Not Found";

if (courseTitleEl) {
  courseTitle = courseTitleEl.textContent;
}

document.querySelectorAll("#scoreTable tbody tr").forEach((row) => {
  let dueDateEl = row.querySelector("td:nth-child(1)");
  let categoryEl = row.querySelector("td.categorycol span.psonly");
  let assignmentNameEl = row.querySelector("td.assignmentcol span");
  let scoreEl = row.querySelector("td.score");

  let dueDate = dueDateEl ? dueDateEl.innerText.trim() : "";
  let category = categoryEl ? categoryEl.innerText.trim() : "";
  let assignmentName = assignmentNameEl ? assignmentNameEl.innerText.trim() : "";
  let scoreText = scoreEl ? scoreEl.innerText.trim() : "";

  let exemptEl = row.querySelector("td:nth-child(7)");
  let excludedEl = row.querySelector("td:nth-child(10)");

  let exempt = !!exemptEl?.querySelector("div.tt-exempt");
  let excluded = !!excludedEl?.querySelector("div.tt-excluded");

  if (dueDate || category || assignmentName || scoreText) {
    let score = null,
      total = null;
    if (scoreText.includes("/") && !scoreText.includes("--") && !exempt && !excluded) {
      let splitScore = scoreText.split("/");
      score = parseFloat(splitScore[0]);
      total = parseFloat(splitScore[1]);
    }

    assignments.push({
      dueDate,
      category,
      assignmentName,
      scoreText,
      score,
      total,
    });
  }
});

let categoryScores = {};
for (let assignment of assignments) {
  if (assignment.score === null || assignment.total === null) continue;

  if (!categoryScores[assignment.category]) {
    categoryScores[assignment.category] = { totalScore: 0, totalWeight: 0 };
  }

  categoryScores[assignment.category].totalScore += assignment.score;
  categoryScores[assignment.category].totalWeight += assignment.total;
}

let weightedAverages = {};
for (let category in categoryScores) {
  let { totalScore, totalWeight } = categoryScores[category];
  weightedAverages[category] = totalWeight ? (totalScore / totalWeight) * 100 : 0;
}

let sortedAssignments = {};
for (let assignment of assignments) {
  if (assignment.score === null || assignment.total === null) continue;

  let category = assignment.category;
  let percentage = (assignment.score / assignment.total) * 100;

  if (!sortedAssignments[category]) {
    sortedAssignments[category] = [];
  }

  sortedAssignments[category].push({ ...assignment, percentage });
}

for (let category in sortedAssignments) {
  sortedAssignments[category].sort((a, b) => a.percentage - b.percentage);
}

let info = window.open("about:blank", "_blank", "height=" + screen.availHeight + ",width=" + screen.availWidth);

let headContent = `
  <head>
    <title>${courseTitle} - Course Info</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f8f9fa;
        color: #333;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 900px;
        margin: auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      h1, h2 {
        text-align: center;
        margin-bottom: 20px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 20px;
      }
      .category {
        font-weight: bold;
        font-size: 18px;
        color: #555;
      }
      .average {
        font-size: 18px;
        color: #28a745;
        font-weight: bold;
      }
      .assignment-container {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .assignment-wrapper {
        display: flex;
        flex-direction: column;
      }
      .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #e9ecef;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
      }
      .category-header:hover {
        background-color: #dee2e6;
      }
      .toggle-button {
        padding: 6px 12px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }
      .toggle-button:hover {
        background-color: #0056b3;
      }
      .assignment-details {
        display: none;
        margin-top: 10px;
      }
      .assignment-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 15px;
      }
      .dash {
        font-weight: bold;
        color: #333;
        margin-left: 5px;
      }
      .score {
        font-weight: bold;
        color: #28a745;
        min-width: 70px;
        margin-left: 5px;
      }
      .assignment-name {
        font-weight: bold;
        color: #dc3545;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .totals {
        font-weight: bold;
        margin-top: 10px;
        font-size: 14px;
        text-align: right;
      }
      .calculator-section {
        margin-top: 40px;
      }
      .calculator-section input {
        width: 60px;
        padding: 5px;
        margin-left: 10px;
        margin-bottom: 12px;
      }
      .calculator-section button {
        margin-top: 10px;
        padding: 8px 12px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .calculator-section button:hover {
        background-color: #218838;
      }
      .final-grade-result {
        font-size: 16px;
        font-weight: bold;
        margin-top: 10px;
        color: #007bff;
      }
      .names {
        position: fixed;
        font-style: italic;
        bottom: 20px;
        right: 20px;
        background-color: #f8f9fa;
        color: #333;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        z-index: 9999;
      }
      .warning {
        color: #dc3545;
      }
      .notice {
        text-align: center;
      }
    </style>
  </head>
`;

let scriptContent = `
  function toggleCategory(category) {
    const list = document.getElementById('list-' + category);
    const btn = document.getElementById('toggle-' + category);
    const isHidden = list.style.display === 'none';
    list.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? 'Collapse' : 'Expand';
  }

  function calculateFinalGrade() {
    let total = 0;
    let totalWeight = 0;

    for (let category in weightedAverages) {
      let weightEl = document.getElementById('weight-' + category);
      let weight = parseFloat(weightEl.value);
      if (!isNaN(weight)) {
        total += (weightedAverages[category] * weight);
        totalWeight += weight;
      }
    }

    if (totalWeight !== 100) {
      document.getElementById('final-grade-result').textContent = 'Weights must total 100%';
      return;
    }

    let finalGrade = total / 100;
    document.getElementById('final-grade-result').textContent = 'Final Grade: ' + finalGrade.toFixed(2) + '%';
  }
 
  function handleWeightInput(input) {
    if (input.value > 100) input.value = 100;
    else if (input.value < 0) input.value = 0;
  }

  const weightedAverages = ${JSON.stringify(weightedAverages)};
`;

let bodyContent = `
  <div class="container">
    <h1>${courseTitle}</h1>
    <h2>Competency Averages</h2>
    <ul>
`;

for (let category in weightedAverages) {
  let average = weightedAverages[category].toFixed(3);
  bodyContent += `
        <li>
          <span class="category">${category}:</span>
          <span class="average">${average}%</span>
        </li>
  `;
}

bodyContent += `
    </ul>

    <h2>Assignment Breakdown</h2>
    <ul>
`;

for (let category in sortedAssignments) {
  let assignmentsList = sortedAssignments[category];
  let totalScored = 0;
  let totalPoints = 0;

  bodyContent += `
        <li>
          <div class="assignment-container">
            <div class="assignment-wrapper">
              <div class="category-header" onclick="toggleCategory('${category}')">
                <span class="category">${category}</span>
                <button class="toggle-button" id="toggle-${category}">Expand</button>
              </div>
              <div class="assignment-details" id="list-${category}" style="display: none;">
  `;

  assignmentsList.forEach((a) => {
    totalScored += a.score;
    totalPoints += a.total;
    bodyContent += `
                <div class="assignment-item">
                  <span class="assignment-name" title="${a.assignmentName}">${a.assignmentName}</span>
                  <span class="dash">-</span>
                  <span class="score">${a.score}/${a.total}</span>
                </div>
    `;
  });

  bodyContent += `
              <div class="totals">Total: ${totalScored.toFixed(2)} / ${totalPoints.toFixed(2)} points</div>
            </div>
          </div>
        </div>
      </li>
  `;
}

bodyContent += `
      </ul>

      <div class="calculator-section">
        <h2>Final Grade Calculator</h2>
        <p>Enter weight for each competency (must total 100%):</p>
`;

for (let category in weightedAverages) {
  bodyContent += `
        <div>
          <label>${category} (%):</label>
          <input type="number" id="weight-${category}" placeholder="0" size="3" oninput="handleWeightInput(this)"/>
        </div>
  `;
}

bodyContent += `
      <button onclick="calculateFinalGrade()">Calculate Final Grade</button>
      <div class="final-grade-result" id="final-grade-result"></div>
    </div>
  </div>
`;

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

const policy = trustedTypes.createPolicy("bypassPolicy", {
  createHTML: (HTML) => HTML,
  createScript: (script) => script,
});

info.document.head.innerHTML = policy.createHTML(headContent);

let script = info.document.createElement("script");
script.textContent = policy.createScript(scriptContent);
info.document.head.appendChild(script);

let footerContent = `
  <div class="names">Made by Sunay</div>
`;

if (!isEmpty(categoryScores)) {
  info.document.body.innerHTML = policy.createHTML(bodyContent + footerContent);
} else {
  info.document.body.innerHTML = policy.createHTML(
    `
    <h2 class="warning">Assignments not found.</h1>
    <h3 class="notice">Please navigate to the assignments page of a course in PowerSchool to see information.</h2>
  ` + footerContent
  );
}
