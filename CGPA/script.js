let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let semesters = JSON.parse(localStorage.getItem("semesters")) || [];
let lastDeleted = null;
const gradePoints = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "F": 0
};
function showToast(msg) {
    let toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.className = "show";

    setTimeout(() => {
        toast.className = "";
    }, 2000);
}
function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("semesters", JSON.stringify(semesters));
}

function renderSubjects() {
    let table = document.getElementById("subjectTableBody");
    table.innerHTML = "";

    subjects.forEach((s, index) => {
        let row = table.insertRow();

        row.innerHTML = `
            <td>${s.rollNo}</td>
            <td>${s.semester}</td>
            <td>${s.subject}</td>
            <td>${s.credits}</td>
            <td>${s.grade}</td>
            <td>${s.gradePoint}</td>
            <td>
                <button onclick="editSubject(${index})">Edit</button>
                <button onclick="deleteSubject(${index})">Delete</button>
            </td>
        `;
    });
}

function renderSemesters() {
    let table = document.getElementById("cgpaTableBody");
    table.innerHTML = "";

    semesters.forEach((s, index) => {
        let row = table.insertRow();

        row.innerHTML = `
            <td>${s.sem}</td>
            <td>${s.gpa}</td>
            <td>${s.credits}</td>
        `;
    });
}
document.getElementById("addSubject").addEventListener("click", function () {
    let rollNo = document.getElementById("rollNo").value;
    let semester = document.getElementById("semester").value;
    let subject = document.getElementById("subject").value;
    let credits = parseFloat(document.getElementById("credits").value);
    let grade = document.getElementById("grade").value;

    if (!semester || !subject || !credits || !grade) {
        showToast("Fill all fields");
        return;
    }

    subjects.push({
        rollNo,
        semester,
        subject,
        credits,
        grade,
        gradePoint: gradePoints[grade]
    });

    saveData();
    renderSubjects();

    document.getElementById("subjectForm").reset();
    showToast("Subject Added");
});
document.getElementById("calculateGPA").addEventListener("click", function () {

    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach(s => {
        totalCredits += s.credits;
        totalPoints += s.credits * s.gradePoint;
    });

    if (totalCredits === 0) return;

    let gpa = (totalPoints / totalCredits).toFixed(2);

    document.getElementById("gpaResult").innerText = "GPA: " + gpa;
});
function editSubject(index) {
    let s = subjects[index];
    document.getElementById("rollNo").value = s.rollNo;
    document.getElementById("semester").value = s.semester;
    document.getElementById("subject").value = s.subject;
    document.getElementById("credits").value = s.credits;
    document.getElementById("grade").value = s.grade;

    subjects.splice(index, 1);

    saveData();
    renderSubjects();

    showToast("Edit Mode Enabled");
}
function deleteSubject(index) {
    lastDeleted = subjects[index];
    subjects.splice(index, 1);

    saveData();
    renderSubjects();

    showUndoToast("Deleted Subject");
}
function showUndoToast(msg) {
    let toast = document.getElementById("toast");
    toast.innerHTML = msg + " <button onclick='undoDelete()'>UNDO</button>";
    toast.className = "show";

    setTimeout(() => {
        toast.className = "";
    }, 4000);
}

function undoDelete() {
    if (lastDeleted) {
        subjects.push(lastDeleted);
        saveData();
        renderSubjects();
        showToast("Restored");
    }
}
document.getElementById("addSemester").addEventListener("click", function () {

    let sem = document.getElementById("cgpaSemester").value;
    let gpa = parseFloat(document.getElementById("semesterGPA").value);
    let credits = parseFloat(document.getElementById("semesterCredits").value);

    if (!sem || !gpa || !credits) {
        showToast("Fill CGPA fields");
        return;
    }

    semesters.push({ sem, gpa, credits });

    saveData();
    renderSemesters();

    document.getElementById("cgpaForm").reset();
    showToast("Semester Added");
});

document.getElementById("calculateCGPA").addEventListener("click", function () {

    let totalCredits = 0;
    let totalPoints = 0;

    semesters.forEach(s => {
        totalCredits += s.credits;
        totalPoints += s.gpa * s.credits;
    });

    if (totalCredits === 0) return;

    let cgpa = (totalPoints / totalCredits).toFixed(2);

    document.getElementById("cgpaResult").innerText = "CGPA: " + cgpa;
});
document.getElementById("predictCgpa").addEventListener("click", function () {

    let currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    let currentCredits = parseFloat(document.getElementById("currentCredits").value);
    let futureSemesters = parseFloat(document.getElementById("futureSemesters").value);
    let futureGpa = parseFloat(document.getElementById("futureGpa").value);
    let futureCredits = parseFloat(document.getElementById("futureCredits").value);

    let futureTotalCredits = futureSemesters * futureCredits;

    let finalCgpa =
        (currentCgpa * currentCredits + futureGpa * futureTotalCredits) /
        (currentCredits + futureTotalCredits);

    document.getElementById("predictionResult").innerText =
        "The Final Predicted CGPA: " + finalCgpa.toFixed(2);
});

/* INIT */
renderSubjects();
renderSemesters();