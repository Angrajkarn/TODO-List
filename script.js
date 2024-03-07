window.onload = function() {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(function(task) {
            addTask(task.text, task.priority, task.category, task.completed);
        });
    }

    document.getElementById('addTaskBtn').addEventListener('click', function() {
        addTask();
    });

    document.getElementById('categoryFilter').addEventListener('change', function() {
        filterTasks();
    });

    makeSortable();
};

function addTask(taskText, priority, category, completed = false) {
    var input = taskText || document.getElementById("taskInput").value;
    var selectedPriority = priority || document.getElementById("prioritySelect").value;
    var selectedCategory = category || document.getElementById("categorySelect").value;
    if (!input) {
        alert("Please enter a task!");
        return;
    }
    var ul = document.getElementById("taskList");
    var li = document.createElement("li");
    li.textContent = input;
    if (completed) {
        li.classList.add("completed");
    }
    var prioritySpan = document.createElement("span");
    prioritySpan.textContent = selectedPriority;
    prioritySpan.classList.add("priority");
    var categorySpan = document.createElement("span");
    categorySpan.textContent = selectedCategory;
    categorySpan.classList.add("category");
    li.appendChild(prioritySpan);
    li.appendChild(categorySpan);
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function() {
        ul.removeChild(li);
        updateLocalStorage();
    };
    li.appendChild(deleteButton);
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("completed-checkbox");
    checkbox.checked = completed;
    checkbox.onclick = function() {
        li.classList.toggle("completed");
        updateLocalStorage();
    };
    li.appendChild(checkbox);
    ul.appendChild(li);
    document.getElementById("taskInput").value = "";
    updateLocalStorage();
}

function updateLocalStorage() {
    var tasks = [];
    var lis = document.querySelectorAll('#taskList li');
    lis.forEach(function(li) {
        tasks.push({
            text: li.textContent.trim(),
            priority: li.querySelector(".priority").textContent,
            category: li.querySelector(".category").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks() {
    var selectedCategory = document.getElementById("categoryFilter").value;
    var lis = document.getElementById("taskList").getElementsByTagName("li");
    Array.from(lis).forEach(function(li) {
        if (selectedCategory === "all" || li.querySelector(".category").textContent === selectedCategory) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

function makeSortable() {
    new Sortable(document.getElementById('taskList'), {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function(evt) {
            updateLocalStorage();
        }
    });
}
