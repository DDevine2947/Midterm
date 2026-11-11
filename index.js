//Loads the shared header from header.html and adds it to the page
function loadHeader() {
    //Fetches the header HTML file
    fetch("HeaderFooter/header.html")
        //gets the response and converts it into text
        .then(function(headertext){
            return headertext.text();
        })
        //runs after the header has been converted to text
        .then(function(data) {
            //finds the id "header" and inserts the header.html into that element
            document.querySelector("#header").innerHTML = data;
        });
}

//calls the function
loadHeader();

//loads the shared footer from footer.html
function loadFooter() {
    fetch("HeaderFooter/footer.html")
        .then(function(footertext) {
            return footertext.text();
        })
        .then(function(data) {
            document.querySelector("#footer").innerHTML = data;
        });
}

//calls the function 
loadFooter();

//handles the contact form when submitted by the user
$("#contactform").submit(function(event) {

    //prevents the page from refreshing
    event.preventDefault();

    //displays a confirm message
    $("#submitConfirm").text("All right, Your message has been submitted! Please wait for a confirmation sent to your email.");

    //clears the form fields after submission
    this.reset();

});

//checks if dark mode was enabled when page loads
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}
//finds the dark mode button on the page
const darkMode = document.querySelector("#darkMode");

if (darkMode) {
    //changes the button text if dark mode is enabled
    if (document.body.classList.contains("dark-mode")) {
        darkMode.textContent = "Light Mode";
    }
    //changes the page css when button is clicked
    darkMode.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        //saves the selected theme and updates button
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkMode.textContent = "Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkMode.textContent = "Dark Mode";
        }
    
    });
}
//finds all FAQ questions based on the class
const faqQuestions = document.querySelectorAll(".faqQuestion");
//adds a click event for each FAQ
faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
        //finds the answer directly below the question
        const answer = question.nextElementSibling;

        //shows the answer if its currently hidden or hides the answer if currently shown
        if (answer.style.display === "none") {
            answer.style.display = "block";
        } else {
            answer.style.display = "none";
        }
    });
});

// Gets the service and pool size dropdowns, calculator button, and result
const service = document.querySelector("#service");
const poolSize = document.querySelector("#poolSize");
const cleaningType = document.querySelector("#cleaningType");
const calculateButton = document.querySelector("#calcPrice");
const calculatorResult = document.querySelector("#calcResult");

//checks that the calculator elements exist
if (service && poolSize && cleaningType && calculateButton) {

    //runs the price calculator when buttons clicked
    calculateButton.addEventListener("click", function () {

        //price begins at 0
        let price = 0;

        //checks if service is cleaning
        if (service.value === "cleaning") {

            //checks if service is weekly
            if (cleaningType.value === "weekly") {

                //checks pool size and adjusts price based on choice
                if (poolSize.value === "small") {
                    price = 110;
                } else if (poolSize.value === "medium") {
                    price = 125;
                } else {
                    price = 140;
                }

                //displays price 
                calculatorResult.textContent =
                    "Estimated service price: $" + price.toFixed(2);

            } else {
                // if customer chose non-scheduled displays message explaining payment
                calculatorResult.textContent =
                    "Non-scheduled cleanings costs $125 per hour. The final price of the service depends on how long our workers are at your pool.";

            }

        } else {
            //sets the opening and closing prices based on size of pool
            if (poolSize.value === "small") {
                price = 200;
            } else if (poolSize.value === "medium") {
                price = 230;
            } else {
                price = 250;
            }
            //displays price
            calculatorResult.textContent =
                "Estimated price of service: $" + price.toFixed(2);
        }
    });

}

//loads the saved tasks from the local storage
let tasks = JSON.parse(localStorage.getItem("infoStorage"))||[];

//saves the task list to the local storage
function saveInfo() {
    localStorage.setItem("infoStorage",JSON.stringify(tasks));
}
//keeps track of which task is being edited, -1 means nothing is being edited
let editTaskIndex = -1;

//function that displays tasks in the table
function displayTasks() {
    //finds the table by looking for the id
    const taskTable = document.querySelector("#taskTable");

    // stops the function if the task table does not exist on the page
    if (!taskTable) {
        return;
    }

    //clears the table before displayig the tasks again
    taskTable.innerHTML = "";
    // finds the search input
    const searchText = document.querySelector("#taskSearch");
    // starts with an empty search value
    let searchValue = "";
    // gets the search text and makes sure it isnt upercase sensitive by converting everything to lowercase
    if(searchText) {
        searchValue = searchText.value.toLowerCase();
    }
    // goes through each task in the tasks array
    for (let i = 0; i < tasks.length; i++) {

        const task = tasks[i];
        // finds the task status filter
        const taskFilter = document.querySelector("#taskFilter");
        //checks whether a specific status filter is selected
        if (taskFilter && taskFilter.value !== "All") {
            // skips tasks that do not match the selected status
            if (task.status !== taskFilter.value) {
                continue;
            }
        }
        // checks if the task name or description matches the search
        if (!task.name.toLowerCase().includes(searchValue) &&
            !task.description.toLowerCase().includes(searchValue)
        ) {
            // skips the task if it doesnt match the search
            continue;
        }
        // adds the task info to the table
        taskTable.innerHTML +=  `
            <tr>
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td>${task.customer}</td>
                <td>${task.service}</td>
                <td>${task.worker}</td>
                <td>${task.date}</td>
                <td>${task.status}</td>
                <td>
                    <button class="btn btn-warning editTask" data-index="${i}">
                        Edit
                    </button>

                    <button class="btn btn-danger deleteTask" data-index="${i}">
                        Delete
                    </button>

                    <button class="completeTask" data-index="${i}">
                        Completed
                    </button>
                </td>
            </tr>
        `;
    }
}

function displayKanban() {
    // finds each kanban column
    const todoCol = document.querySelector("#todoCol");
    const inProgressCol = document.querySelector("#inProgressCol");
    const completedCol = document.querySelector("#completedCol");
    // stops the function if any of the columns are missing
    if (!todoCol || !inProgressCol || !completedCol) {
        return;
    }

    // clears the columns before adding the task cards again
    todoCol.innerHTML = "";
    inProgressCol.innerHTML = "";
    completedCol.innerHTML = "";
    // goes through every task in the tasks array
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        // creates a card showiing the task info and status
        const taskCard = `
            <div class="border rounded p-3 mb-3">
                <h4>${task.name}</h4>
                <p>${task.description}</p>
                <p>Customer: ${task.customer}</p>
                <p>Due: ${task.date}</p>
            

                <button class="btn btn-primary moveTask"
                        data-index="${i}"
                        data-status="To Do">
                    To Do
                </button>

                <button class="btn btn-primary moveTask"
                        data-index="${i}"
                        data-status="In Progress">
                    In Progress
                </button>

                <button class="btn btn-primary moveTask"
                        data-index="${i}"
                        data-status="Completed">
                    Completed
                </button>
            </div>

        `;

        // adds the task card to the column matching its status
        if (task.status === "To Do") {
            todoCol.innerHTML += taskCard;
        }

        else if (task.status === "In Progress") {
            inProgressCol.innerHTML += taskCard;
        }

        else if (task.status === "Completed") {
            completedCol.innerHTML += taskCard;
        }
    }
}
// finds all kanban columns 
const kanBanColumns = document.querySelectorAll(".kanban-column");
// adds a click event listener to each kanban column
for (let i = 0; i < kanBanColumns.length; i++) {

    kanBanColumns[i].addEventListener("click", function(event) {
        // checks if the clicked element is a task movement button
        if (event.target.classList.contains("moveTask")) {

            // gets the index of the task that was clicked
            const taskIndex = Number(event.target.dataset.index);
            //gets the new status from the button
            const newStatus = event.target.dataset.status;
            // updates the tasks status in the tasks array
            tasks[taskIndex].status = newStatus;
            //saves the updated tasks
            saveInfo();
            //refreshes the table
            displayTasks();
            //refreshes the kanban board
            displayKanban();
            //updates the task counters
            updateTaskAnalytics();
        }
    });
}

function updateTaskAnalytics() {
    // finds the task counters on the page
    const todoCount = document.querySelector("#todoTasks");
    const progressCount = document.querySelector("#inProgressTasks");
    const completedCount = document.querySelector("#completedTasks");
    // stops the function if any of the counters are missing
    if (!todoCount || !progressCount || !completedCount) {
        return;
    }
    // starts each task counter at zero
    let todo = 0;
    let progress = 0;
    let completed = 0;
    // goes through every task and counts its status
    for (let i = 0; i < tasks.length; i++) {

        //adds on to the to do counter
        if (tasks[i].status === "To Do") {
            todo++; 
        }
        //adds to the in progress counter
        else if (tasks[i].status === "In Progress") {
            progress++;
        }
        //adds the completed counter
        else if (tasks[i].status === "Completed") {
            completed++;
        }
    }
    // displays the updated task totals on the page
    todoCount.textContent = todo;
    progressCount.textContent = progress;
    completedCount.textContent = completed;
}

// finds the task form on the page
const taskForm = document.querySelector("#taskForm");
// checks if the task form even exists
if (taskForm) {
    // runs when the form is submitted
    taskForm.addEventListener("submit", function (event) {
        //prevents the page from refreshing everytime form is submitted
        event.preventDefault();
        // gets the values entered into each field
        const taskName = document.querySelector("#taskName").value;
        const taskDesc = document.querySelector("#taskDesc").value;
        const customerName = document.querySelector("#customerName").value;
        const serviceType = document.querySelector("#serviceType").value;
        const assignedWorker = document.querySelector("#assignedWorker").value;
        const dueDate = document.querySelector("#dueDate").value;
        const taskStatus = document.querySelector("#taskStatus").value;
        // creates an objec containing new task info
        const newTask = {
            name: taskName,
            description: taskDesc,
            customer: customerName,
            service: serviceType,
            worker: assignedWorker,
            date: dueDate,
            status: taskStatus,
            //saves the date and time
            taskDate: new Date().toLocaleString()
        };
        // checks if a new task is being created
        if (editTaskIndex === -1) {
            //adds the new task to the array
            tasks.push(newTask);
        } else {
            // replaces the selected task with the updated info
            tasks[editTaskIndex] = newTask;
            // resets the edit index after updating the task
            editTaskIndex = -1;
        }
        saveInfo();

        displayTasks();

        displayKanban();

        updateTaskAnalytics();
        // clears the form fields
        taskForm.reset();
        //displays a confirmation message
        alert("Tasks has been updated");
    });
        // find the task table
        const taskTable = document.querySelector("#taskTable");
        // checks if the task table exists
        if (taskTable) {
            // handles clicks on buttons in the table
            taskTable.addEventListener("click", function (event) {
                // checks if the delete button was clicked
                if (event.target.classList.contains("deleteTask")) {
                    // gets the index of the selected task
                    const taskIndex = Number(event.target.dataset.index);
                    // removes the selected task from the array
                    tasks.splice(taskIndex, 1);

                    // saves and refreshes the info
                    saveInfo();
                    displayTasks();
                    displayKanban();
                    updateTaskAnalytics();
                }

                // checks if the edit button was clicked
                else if (event.target.classList.contains("editTask")) {

                    // gets the index and info of the selection
                    const taskIndex = Number(event.target.dataset.index);
                    const task = tasks[taskIndex];
                    // stores the index of the task being edited
                    editTaskIndex = taskIndex;
                    // fills the form with the exisiting task info
                    document.querySelector("#taskName").value = task.name;
                    document.querySelector("#taskDesc").value = task.description;
                    document.querySelector("#customerName").value = task.customer;
                    document.querySelector("#serviceType").value = task.service;
                    document.querySelector("#assignedWorker").value = task.worker;
                    document.querySelector("#dueDate").value = task.date;
                    document.querySelector("#taskStatus").value = task.status;
                }

                // checks if the completed button was clicked
                else if (event.target.classList.contains("completeTask")) {
                    // gets the index of the selected task
                    const taskIndex = Number(event.target.dataset.index);
                    // changes the status to completed
                    tasks[taskIndex].status = "Completed";
                    saveInfo();
                    displayTasks();
                    displayKanban();
                    updateTaskAnalytics();
                }
            })
            // finds the task search input
            const taskSearch = document.querySelector("#taskSearch");

            // checks if the search input exists
            if(taskSearch) {
                // refreshes the task table when the search text changes
                taskSearch.addEventListener("input", function () {
                    displayTasks();
                })
            }
            // finds the task status filter
            const taskFilter = document.querySelector("#taskFilter");

            //checks if the filter exists
            if (taskFilter) {
                // refreshes the task table when a different filter is set
                taskFilter.addEventListener("change", function () {
                    displayTasks();
                });
            }
        }
}

// displays the lastest task activity
function displayLatestActivity() {
    // finds the activity list on the page
    const activityList = document.querySelector("#activityList");
    // stops the function if the activity doesnt exist
    if (!activityList) {
        return;
    }
    // clears the activity list before displaying it again
    activityList.innerHTML ="";
    // checks if there are no tasks
    if (tasks.length === 0) {
        // displays a message when there is no activity
        activityList.innerHTML = `
            <li>
            No recent activity
            </li>
            `;
        return
    }

    // goes through the tasks starting with a most recent
    for (let i = tasks.length - 1; i >= 0; i--) {
        const task = tasks[i];
        // checks if the task has a saved creation date
        if (task.taskDate) {
            // adds the task name and creation date to the activity 
            activityList.innerHTML += `
            <li>
                Task added ${task.name}
                - ${task.taskDate}
            </li>
            `;
        }
    }

}

// stores te chart for it to be updated later
let taskChart;
// displays a chart showing the number of tasks in each status
function displayChart() {
    // finds the canvas used for the chart
    const canvas = document.querySelector("#taskChart");
    // stops the function if the chart canvas does not exist
    if (!canvas) {
        return;
    }
    // starts each task counter at zero
    let todo = 0;
    let progress = 0;
    let completed = 0;

    // counts the tasks based on their current status
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === "To Do") {
            todo++;
        } else if (tasks[i].status === "In Progress") {
            progress++;
        } else if (tasks[i].status === "Completed") {
            completed++;
        }
    }

    // removes the old chart before creating a new one
    if (taskChart) {
        taskChart.destroy();
    }

    // creates a bar chart using chart.js
    taskChart = new Chart(canvas, {
        type: "bar",
        data: {
            // names displayed along the chart
            labels: ["To Do", "In Progress", "Completed"],
            // task totals displayed in the chart
            datasets: [{
                label: "Number of Tasks",
                data: [todo, progress, completed]
            }]
        },
        // makes the chart adjust to the available space 
        options: {
            responsive: true
        }
    });

}
// gets the current weather info
function displayWeather() {

    // finds the weather display on the page
    const weatherInfo = document.querySelector("#weather")

    // stops the function if the weather element does not exist
    if (!weatherInfo) {
        return;
    }

    // fetches weather info from the API
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7891&longitude=-73.1350&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York")

    //converts the API response into JSON
        .then(function(response) {
            return response.json();
        })

        // uses the weather data received from the API
        .then(function(data) {
            const weather = data.current;
            // displays the temperature, humidity and wind speed
            weatherInfo.textContent = 
                "Temperature: " + weather.temperature_2m + " degrees F | " +
                "Humidity: " + weather.relative_humidity_2m + "% | "  +
                "Wind Speed: " + weather.wind_speed_10m + " mph"; 
            })
            // displays a message if the weather info request fails
            .catch(function() {
                weatherInfo.textContent = "Information for current weather is currently unavailable";
            });
}

// calls all the functions created
displayWeather();

displayLatestActivity();
displayTasks();
displayKanban();
updateTaskAnalytics();
displayChart();