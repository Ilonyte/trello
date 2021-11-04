document.getElementById('myForm').addEventListener('submit', addTask);
fetchTasks();
let taskList = JSON.parse(localStorage.getItem('tasks'));
const draggables = document.querySelectorAll(".draggable");
const boxes = document.querySelectorAll(".box");
let allTasks = document.querySelectorAll(".draggable");
document.getElementById("filter").addEventListener("keyup", filterTasks);

function addTask(e) {
    e.preventDefault ();
    var input = document.querySelector('.task').value;
    if (input != "") {
        var task = {
            id: Math.random()
                .toString()
                .substr(2, 7),
            task: input
        };

        if (localStorage.getItem('tasks') === null) {
            var tasks = [];
            tasks.push(task);
            // nustatymas i localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            setTimeout(function () { location.reload(1); }, 800);
        } else {
            // gauti uzduoti is localStorage
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            // prideti uzduoti i masyva
            tasks.push(task);
            // cia yra Re-set back to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            setTimeout(function () { location.reload(1); }, 800);
        }

        // svari anketa
        document.getElementById('myForm').reset();

    }

    fetchTasks();

    // uzkirsti kelia formos pakeitimui
    e.preventDefault();
}

// istrinti uzduoti
function deleteTask(task, id) {
    var tasks = JSON.parse(localStorage.getItem(id));
    tasks = removeDuplicates(tasks, "task")
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].task == task) {
            // pasalinti is masyvo
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem(String(id), JSON.stringify(tasks));
    setTimeout(function () { location.reload(1); }, 700);
    fetchTasks();
}

let createReplyButtonCommentView = (operationType, commentOldData) => {
    let div = document.createElement("div");
    div.innerHTML = `<input type="text" id="newTask" value=${commentOldData} /> <button>${operationType}</button>`;

    return div;
};

let editTask = (task, t, element) => {
    var tasks = JSON.parse(localStorage.getItem(element));
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == String(t)) {
            // pasalinti is masyvo
            tasks[i].task = task;
        }
    }
    localStorage.setItem(element, JSON.stringify(tasks));
    setTimeout(function () { location.reload(1); }, 700);

}
function removeFromStorage(id, task) {
    var tasks = JSON.parse(localStorage.getItem(id));
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].task == task) {
            // pasalinti is masyvo
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem(id, JSON.stringify(tasks));
    setTimeout(function () { location.reload(1); }, 700);
    fetchTasks();
    

}
// gauti visas uzduotis
function fetchTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    var tasksResults = document.getElementById('lists');
    tasks = removeDuplicates(tasks, "task");
    // Build output/ sukurti output
    tasksResults.innerHTML = '';
    if (tasks.length > 0) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i].task;
            var id = tasks[i].id

            tasksResults.innerHTML += `<div id=${id} class="card draggable" draggable="true">` +
                `<h3>` + task +
                `<button>Edit</button>` +
                `<button>X</button>` +
                '</h3>' +
                '</div>';
        }
    }
    if (localStorage.getItem('working')) {
        var tasks = JSON.parse(localStorage.getItem('working'));
        var tasksResults = document.getElementById('working');

        tasks = removeDuplicates(tasks, "task")

        // Build output/sukurti output
        tasksResults.innerHTML = '';
        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i].task;
                var id = tasks[i].id;

                tasksResults.innerHTML += `<div id=${id} class="card draggable" draggable="true">` +
                    `<h3>` + task +
                    `<button>Edit</button>` +
                    `<button>X</button>` +
                    '</h3>' +
                    '</div>';
            }
        }
    }
    if (localStorage.getItem('completed')) {
        var tasks = JSON.parse(localStorage.getItem('completed'));
        var tasksResults = document.getElementById('completedList');
        tasks = removeDuplicates(tasks, "task");

        // Build output/ sukurti output
        tasksResults.innerHTML = '';
        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i].task;
                var id = tasks[i].id;

                tasksResults.innerHTML += `<div id=${id} class="card draggable" draggable="true">` +
                    `<h3>` + task +
                    `<button>Edit</button>` +
                    `<button>X</button>` +
                    '</h3>' +
                    '</div>';
            }
        }
    }

}
function removeDuplicates(array, key) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((el) => (
            el[key] === obj[key]
        ))
    )
}
function getDragAfterItem(box, y) {
    const elements = [...box.querySelectorAll(".draggable:not(.dragging)")];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function filterTasks(e) {
    e.preventDefault();
    var text = e.target.value;
    Array.from(allTasks).forEach(function (task) {
        if (task.innerText.slice(0, -5).indexOf(text) != -1) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    })
}

document.getElementById('lists').addEventListener("click", e => {
    e.preventDefault();
    if (e.target.innerText === "X") {
        var id = e.target.parentNode.parentNode.parentNode.classList;
        deleteTask(e.target.parentNode.firstChild.data, id);
    }
    else if (e.target.innerText === "Edit") {
        e.target.parentNode.appendChild(
            createReplyButtonCommentView("Save Changes", e.target.parentNode.firstChild.data)
        );
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText === "Save Changes") {
        const newTask = {
            task: e.target.parentNode.firstChild.value
        };
        let id = e.target.parentNode.parentNode.parentNode.id;
        editTask(newTask.task, id, "tasks")
        fetchTasks();
    }
});

document.getElementById('working').addEventListener("click", e => {
    e.preventDefault();
    if (e.target.innerText === "X") {
        var id = e.target.parentNode.parentNode.parentNode.id;
        deleteTask(e.target.parentNode.firstChild.data, id);
    }
    else if (e.target.innerText === "Edit") {
        e.target.parentNode.appendChild(
            createReplyButtonCommentView("Save Changes", e.target.parentNode.firstChild.data)
        );
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText === "Save Changes") {
        const newTask = {
            task: e.target.parentNode.firstChild.value
        };
        let id = e.target.parentNode.parentNode.parentNode.id;
        editTask(newTask.task, id, "working");
        fetchTasks();
    }
});
document.getElementById('completedList').addEventListener("click", e => {
    e.preventDefault();
    if (e.target.innerText === "X") {
        var id = e.target.parentNode.parentNode.parentNode.parentNode.classList[1];
        deleteTask(e.target.parentNode.firstChild.data, id);
    }
    else if (e.target.innerText === "Edit") {
        e.target.parentNode.appendChild(
            createReplyButtonCommentView("Save Changes", e.target.parentNode.firstChild.data)
        );
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText === "Save Changes") {
        const newTask = {
            task: e.target.parentNode.firstChild.value
        };
        let id = e.target.parentNode.parentNode.parentNode.id;
        editTask(newTask.task, id, "completed");
        fetchTasks();
    }
});

draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    })

    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    })
})
boxes.forEach(box => {
    box.addEventListener("dragover", e => {
        e.preventDefault();
        const afterElement = getDragAfterItem(box, e.clientY);
        const dragging = document.querySelector(".dragging");
        var target = box.classList[1];
        if (afterElement == null) {
            box.appendChild(dragging);
            var task = {
                id: dragging.id,
                task: dragging.firstChild.textContent.slice(0, -5)
            };
            if (target === "working") {
                if (localStorage.getItem('working') === null) {
                    // Init masyvas
                    var workings = [];
                    // prideti prie masyvo
                    workings.push(task);
                    // nustatyti i localStorage
                    localStorage.setItem('working', JSON.stringify(workings));
                    setTimeout(function () { location.reload(1); }, 300);
                } else {
                    // gauti uzduoti is localStorage
                    var workings = JSON.parse(localStorage.getItem('working'));
                    // prideti uzduotis i masyva
                    workings.push(task);
                    // nustatytas i localStorage
                    localStorage.setItem('working', JSON.stringify(workings));
                    setTimeout(function () { location.reload(1); }, 300);
                    // jokiu dubliu
                }
            }
            else if (target === "completed") {
                if (localStorage.getItem('completed') === null) {
                    // Init array masyvas
                    var completed = [];
                    // prideti prie masyvo
                    completed.push(task);
                    // nustatytas i localStorage
                    localStorage.setItem('completed', JSON.stringify(completed));
                    setTimeout(function () { location.reload(1); }, 300);
                } else {
                    // gauti uzduoti is localStorage
                    var completed = JSON.parse(localStorage.getItem('completed'));
                    // prideti i masyva
                    completed.push(task);
                    // nustatytas i localStorage
                    localStorage.setItem('completed', JSON.stringify(completed));
                    setTimeout(function () { location.reload(1); }, 300);
                    // nera dubliu
                }
            }
            else if (target === "tasks") {
                if (localStorage.getItem('tasks') === null) {
                    // Init array/masyvas
                    var tasks = [];
                    // prideti prie array
                    tasks.push(task);
                    // nustatytas i localStorage
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                } else {
                    // gauti uzduotis is localStorage
                    var tasks = JSON.parse(localStorage.getItem('tasks'));
                    // prideti uzduoti i masyva
                    tasks.push(task);
                    // nustatytas i localStorage
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    // nera jokiu dubliu
                }
            }
        } else {
            box.insertBefore(dragging, afterElement);
        }

    })
})