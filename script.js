const closeForm = document.getElementById("close-form");
const form = document.getElementsByClassName("form");
const form1 = document.getElementsByClassName("container");
const submitForm = document.getElementById("submit-btn");
const todoContainer = document.getElementsByClassName("todoContainer");
const todoCount = document.getElementsByClassName("todoCount");

form1[0].addEventListener("submit", handleForm);

let allTasks = [];
let edit = false;

function loadtasks() {
  let storedTasks = localStorage.getItem("tasks");
  allTasks = storedTasks ? JSON.parse(storedTasks) : [];
}

loadtasks();
renderTask(allTasks);

let currId = -1;

function toggleform() {
  form[0].classList.toggle("unhide");
  console.log(form[0].classList);
}

function handleForm(e) {
    e.preventDefault();

    // Collect form data
    let newTask = {
        task: e.target.querySelector('#name').value,
        date: e.target.querySelector('#day').value,
        priority: getSelectedRadioValue('priority'),
        status: e.target.querySelector('#status').value,
        priorCode: getCode(getSelectedRadioValue('priority'))
    };

    // Perform action based on edit mode
    if (!edit) {
        // Add new task
        addTask(newTask);
    } else {
        // Edit existing task
        newTask = editTask(newTask);
        edit = false;
    }

    // Reset form and toggle visibility
    toggleform();
    e.target.reset();
}


function getCode(p){
    if(p==='low') return 3;
    else if(p==='medium') return 2;
    return 0;
}

function getSelectedRadioValue(name) {
    const radioButtons = document.getElementsByName(name);
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
    return null; // Return null or handle the case where no radio button is selected
}

function savetasks(allTasks) {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function addTask(newTask) {
  console.log(newTask)
  allTasks.push(newTask);
  savetasks(allTasks);
  renderTask(allTasks);
}

function deleteTask(id) {
  allTasks.splice(id, 1);
  savetasks(allTasks);
  renderTask(allTasks);
}
function editTask(task) {
    allTasks[currId].task = task.task;
    allTasks[currId].date = task.date;
    allTasks[currId].priority = task.priority; // Add this line to update priority
    allTasks[currId].status = task.status; // Add this line to update status
    savetasks(allTasks); // Save the updated tasks to local storage
    renderTask(allTasks); // Render the updated tasks
}

function setTask(task, index) {
    edit = true;
    form[0].classList.add("unhide");
    form1[0].elements["name"].value = task.task;
    form1[0].elements["day"].value = task.date;

    // Set the priority radio button based on the task's priority
    const priorityRadioButtons = document.getElementsByName("priority");
    for (const radioButton of priorityRadioButtons) {
        if (radioButton.value === task.priority) {
            radioButton.checked = true;
        }
    }

    // Set the status select based on the task's status
    form1[0].elements["status"].value = task.status;

    currId = index;
}

function renderTask(allTasks) {
    const todoContainer = document.querySelector('.todoContainer');
    const startedSection = document.querySelector('.startedContainer');
    const completedSection = document.querySelector('.completedContainer');
    
    // Clear existing content
    todoContainer.innerHTML = '';
    startedSection.innerHTML = '';
    completedSection.innerHTML = '';

    allTasks.forEach((newTask, index) => {
        let taskNode = document.createElement('div');
        taskNode.setAttribute('class', 'task');

        let deleteTaskBtn = document.createElement('button');
        deleteTaskBtn.setAttribute('class', 'delete-task');
        deleteTaskBtn.innerText = 'del';

        let editTaskBtn = document.createElement('button');
        editTaskBtn.setAttribute('class', 'edit-task');
        editTaskBtn.innerText = 'edit';

        let Task = document.createElement('p');
        Task.setAttribute('class', 'subtask');
        Task.innerText = newTask.task;

        let Date = document.createElement('p');
        Date.setAttribute('class', 'subDate');
        Date.innerText = newTask.date.substring(0, 10) + ' ' + newTask.date.substring(11, newTask.date.length);

        taskNode.appendChild(Task);
        taskNode.appendChild(Date);
        taskNode.appendChild(deleteTaskBtn);
        taskNode.appendChild(editTaskBtn);

        deleteTaskBtn.addEventListener('click', () => {
            deleteTask(index);
        });

        editTaskBtn.addEventListener('click', () => {
            setTask(newTask, index);
        });

        if (newTask.status === 'inprogress') {
            // Add the task to the "Started" section
            startedSection.appendChild(taskNode);
        }
        else if (newTask.status === 'done') {
            // Add the task to the "Started" section
            completedSection.appendChild(taskNode);
        } else {
            // Add the task to the "Todo" section
            todoContainer.appendChild(taskNode);
        }
    });

    // Update the todoCount in the "Todo" section
    document.querySelector('.todoCount').textContent = todoContainer.children.length;

    document.querySelector('.startedCount').textContent = startedSection.children.length;
    document.querySelector('.completedCount').textContent = completedSection.children.length;
}



const statusoption = document.getElementById('priority-sort');

statusoption.addEventListener('change',(e)=>sort(e))

function sort(e){
    console.log(e.target.value)
    const x = allTasks.filter((t)=>t.priority===e.target.value)
    renderTask(x)
}


const search = document.getElementById('srch');
const searchbtn = document.getElementById('srchbtn');

searchbtn.addEventListener('click',handlesearch);


function handlesearch() {
    
    const x = allTasks.filter((t)=>t.task.toLowerCase().includes(search.value.toLowerCase()))
    renderTask(x);
}
