// Start Get or Select All Element.
const timeELement = document.querySelector('header .time');
const dateELement = document.querySelector('header .date');
const inputTask = document.querySelector('.content form input');
const newTasks = document.querySelector('.new-tasks .tasks');
const completedTasks = document.querySelector('.completed-tasks .tasks');
const newTasksCount = document.querySelector('.new-tasks .new-tasks-count');
const completedCount = document.querySelector('.completed-tasks .completed-count');
const btnSubmit = document.querySelector('.content form button');
// End Get or Select All Element.
// Start Function Get Time.
let format;
function getTime() {
    const date = new Date();
    let hours = date.getHours();
    hours = hours > 12 ? hours - 12 : hours;
    hours = hours === 0 ? 12 : hours;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    format = hours < 12 ? "Am" : "Pm"
    return `${hours} : ${minutes} : ${seconds} ${format}`
}
timeELement.textContent = getTime();
setInterval(() => {
    timeELement.textContent = getTime();
}, 1000);
// End Function Get Time.
// Start Function Get Date.
function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month} / ${day} / ${year}`;
}
dateELement.textContent = getDate();
// End Function Get Date.
// Start Variables.
let tasksArray; // Initialize To The Array.
// End Variables.
// Start Function To Check If Found Tasks In Local Storage.
function checkIfFoundDataInTheLocalStorage(localStorage) {
    if (localStorage["tasks"]) {
        tasksArray = JSON.parse(localStorage["tasks"]);
        createElementsAndAddToPage();
    } else {
        tasksArray = []; // This is Empty Array To Save The Tasks.
    }
}
// End Function To Check If Found Tasks In Local Storage.
// Start Run Function When Page Load.
window.onload = 
checkIfFoundDataInTheLocalStorage(window.localStorage), // Check Window Of the Local Storage.
setCountTasks(newTasksCount, newTasks.children.length),
setCountTasks(completedCount, completedTasks.children.length),
focusOnInput(inputTask),
checkOfCountTasks(newTasks, "No Tasks Added Yet."),
checkOfCountTasks(completedTasks, "No Tasks Completed Yet.");
// End Run Function When Page Load.
// Start Function To Return False When User Open The Content Menu.
// document.oncontextmenu = () => {
//     return false;
// }
// End Function To Return False When User Open The Content Menu.
// Start Function Prevent Default.
function preventDefault(event) {
    event.preventDefault();
}
// End Function Prevent Default.
// Start Function Clear Input.
function clearInput(input) {
    input.value = '';
}
// End Function Clear Input.
// Start Function Create Task.
function createTask(input) {
    const task = {
        id: Date.now(),
        value: input.value,
        completed: false,
        timeAdded: getTime()
    }

    sendTaskToArr(task, tasksArray);
    sendToLocalStorage(tasksArray, window.localStorage);
}
// End Function Create Task.
// Start Function Send Task To Arr.
function sendTaskToArr(task, arr) {
    arr.push(task);
}
// End Function Send Task To Arr.
// Start Function Send Tasks To Local Storage.
function sendToLocalStorage(tasks, localStorage) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// End Function Send Tasks To Local Storage.
// Start Function Create The Elements and Add To Page.
function createElementsAndAddToPage() {
    const arr = tasksArray;
    newTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        const taskElement = document.createElement('div');
        taskElement.className = `${!arr[i].completed ? "task" : "task done"}`;
        taskElement.setAttribute("onclick", "updateTaskUi(this)");
        taskElement.dataset.id = arr[i].id;
        taskElement.innerHTML = `
            <div class="d-flex align-items-center gap-1">
                <input type="checkbox" ${arr[i].completed ? "checked" : false}/>
                <p>${arr[i].value}</p>
            </div>
            <div class="ms-auto">${(arr[i].timeAdded).slice(0, 7)+ " " + format}</div>
        `
        if (!arr[i].completed) {
            newTasks.appendChild(taskElement);
        } else {
            completedTasks.appendChild(taskElement);
        }
    }
}
// End Function Create The Elements and Add To Page.
// Start Function To Update The Task Ui.
// console.log(newTasks.localName);
function updateTaskUi(task) {
    updateTaskArr(task, tasksArray);
    checkOfCountTasks(newTasks, "No Tasks Added Yet.");
    checkOfCountTasks(completedTasks, "No Tasks Completed Yet.");
    setCountTasks(newTasksCount, newTasks.children.length);
    setCountTasks(completedCount, completedTasks.children.length);
}
// End Function To Update The Task Ui.
// Start Function To Update The Task Array.
function updateTaskArr(task, arr) {
    arr.forEach(ele => {
        if (ele['id'] == task.dataset.id) {
            if (ele['completed']) {
                ele['completed'] = false;
            } else {
                ele['completed'] = true;
            }
            sendToLocalStorage(tasksArray, window.localStorage);
            createElementsAndAddToPage();
        }
    });
}
// End Function To Update The Task Array.
// Start Function Check of Count Tasks.
function checkOfCountTasks(targetTasksParent, textContent) {
    targetTasksParent.querySelectorAll(".task").length == 0 ? 
    targetTasksParent.textContent = textContent : false;
}
// End Function Check of Count Tasks.
// Start Function To Set The Count Tasks.
function setCountTasks(countEle, length) {
    countEle.textContent = length;
}
// End Function To Set The Count Tasks.
// Start Function Focus On Input Task When Page Onload.
function focusOnInput(input) {
    input.focus();
}
// End Function Focus On Input Task When Page Onload.
// Start Function Rerender Tasks.
function rerender(boolValue) {
    const tasks = tasksArray;
    const newArrOfTasks = [];
    tasks.filter(task => {
        task.completed == boolValue ? newArrOfTasks.push(task) : false;
    })
    sendToLocalStorage(newArrOfTasks, window.localStorage);
    checkIfFoundDataInTheLocalStorage(window.localStorage);
    createElementsAndAddToPage();
    checkOfCountTasks(newTasks, "No Tasks Added Yet.");
    checkOfCountTasks(completedTasks, "No Tasks Completed Yet.");
}
// End Function Rerender Tasks.
// Start Function To Clear All Tasks In Tasks Div.
function clearTasks(btn) {
    if (btn.dataset.type === "newTasks") {
        rerender(true);
        setCountTasks(newTasksCount, newTasks.children.length);
    } else {
        rerender(false);
        setCountTasks(completedCount, completedCount.children.length);
    }
}
// End Function To Clear All Tasks In Tasks Div.
// Start Trigger The Functions When Click On The Btn Submit.
btnSubmit.addEventListener("click", () => {
    if (inputTask.value !== '') { 
        createTask(inputTask);
        createElementsAndAddToPage(newTasks);
        setCountTasks(newTasksCount, newTasks.querySelectorAll('.task').length);
        setCountTasks(completedCount, completedTasks.querySelectorAll('.task').length);
        checkOfCountTasks(newTasks, "No Tasks Added Yet.");
        checkOfCountTasks(completedTasks, "No Tasks Completed Yet.");
        clearInput(inputTask);
    }
});
// End Trigger The Functions When Click On The Btn Submit.
