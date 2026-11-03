function loadHeader() {
    fetch("HeaderFooter/header.html")
        .then(function(headertext){
            return headertext.text();
        })
        .then(function(data) {
            document.querySelector("#header").innerHTML = data;
        });
}

loadHeader();

function loadFooter() {
    fetch("HeaderFooter/footer.html")
        .then(function(footertext) {
            return footertext.text();
        })
        .then(function(data) {
            document.querySelector("#footer").innerHTML = data;
        });
}

loadFooter();

$("#contactform").submit(function(event) {

    event.preventDefault();

    $("#submitConfirm").text("All right, Your message has been submitted! Please wait for a confirmation sent to your email.");

    this.reset();

});

const faqQuestions = document.querySelectorAll(".faqQuestion");

faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
        const answer = question.nextElementSibling;

        if (answer.style.display === "none") {
            answer.style.display = "block";
        } else {
            answer.style.display = "none";
        }
    });
});

const service = document.querySelector("#service");
const poolSize = document.querySelector("#poolsize");
const cleaningType = document.querySelector("#cleaningType");
const calculateButton = document.querySelector("#calcPrice");
const calculatorResult = document.querySelector("#calcResult");

if (service && poolSize && cleaningType && calculateButton) {

    calculateButton.addEventListener("click", function () {

        let price = 0;

        if (service.value === "cleaning") {

            if (cleaningType.value === "weekly") {

                if (poolSize.value === "small") {
                    price = 110;
                } else if (poolSize.value === "medium") {
                    price = 125;
                } else {
                    price = 140;
                }

                calculatorResult.textContent =
                    "Estimated service price: $" + price.toFixed(2);

            } else {

                calculatorResult.textContent =
                    "Non-scheduled cleanings costs $125 per hour. The final price of the service depends on how long our workers are at your pool.";

            }

        } else {

            if (poolSize.value === "small") {
                price = 200;
            } else if (poolSize.value === "medium") {
                price = 230;
            } else {
                price = 250;
            }

            calculatorResult.textContent =
                "Estimated price of service: $" + price.toFixed(2);
        }
    });

}

let tasks = [];

function displayTasks() {
    const taskTable = document.querySelector("#taskTable");

    if (!taskTable) {
        return;
    }

    taskTable.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        taskTable.innerHTML +=  `
            <tr>
                <td>${task.name}</td>
                <td>${task.customer}</td>
                <td>${task.service}</td>
                <td>${task.worker}</td>
                <td>${task.date}</td>
                <td>${task.status}</td>
                <td>
                    <button class="btn btn-danger deleteTask" data-index="${i}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }
}

function updateTaskAnalytics() {
    const todoCount = document.querySelector("#todoCount");
    const progressCount = document.querySelector("#progressCount");
    const completedCount = document.querySelector("#completedCount");

    if (!todoCount || !progressCount || !completedCount) {
        return;
    }

    let todo = 0;
    let progress = 0;
    let completed = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === "To Do") {
            todo++; 
        }

        else if (tasks[i].status === "In Progress") {
            progress++;
        }

        else if (tasks[i].status === "Completed") {
            completed++;
        }
    }

    todoCount.textContent = todo;
    progressCount.textContent = progress;
    completedCount.textContent = completed;
}


const taskForm = document.querySelector("#taskForm");

if (taskForm) {

    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const taskName = document.querySelector("#taskName").value;
        const customerName = document.querySelector("#customerName").value;
        const serviceType = document.querySelector("#serviceType").value;
        const assignedWorker = document.querySelector("#assignedWorker").value;
        const dueDate = document.querySelector("#dueDate").value;
        const taskStatus = document.querySelector("#taskStatus").value;

        const newTask = {
            name: taskName,
            customer: customerName,
            service: serviceType,
            worker: assignedWorker,
            date: dueDate,
            status: taskStatus
        };

        tasks.push(newTask);

        displayTasks();

        updateTaskAnalytics();

        taskForm.reset();

        alert("Task has been added");
    });

        const taskTable = document.querySelector("#taskTable");

        if (taskTable) {
            taskTable.addEventListener("click", function (event) {
                
                if (event.target.classList.contains("deleteTask")) {
                    
                    const taskIndex = event.target.dataset.index;

                    tasks.splice(taskIndex, 1);

                    displayTasks();
                    updateTaskAnalytics();
                }
            })
        }
}