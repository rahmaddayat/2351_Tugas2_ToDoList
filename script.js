class ToDoList {
  constructor() {
    this.addBtn = document.querySelector("#add-btn");
    this.newTaskInput = document.querySelector("#wrapper input");
    this.taskContainer = document.querySelector("#tasks");
    this.error = document.getElementById("error");
    this.countValue = document.querySelector(".count-value");
    this.taskCount = 0;
    this.progressCircle = document.getElementById("progress-circle");
    this.progressNumber = document.getElementById("number");
    this.editingTask = null;
    
    this.addBtn.addEventListener("click", () => this.addTask());
    document.addEventListener("click", (event) => this.globalClickHandler(event));
    
    this.init();
  }

  init() {
    this.taskCount = 0;
    this.displayCount();
    this.updateProgressBar();
  }

  displayCount() {
    this.countValue.innerText = this.taskCount;
  }

  updateProgressBar() {
    const tasks = document.querySelectorAll(".task");
    const totalTasks = tasks.length;
    const completedTasks = document.querySelectorAll(".task-check:checked").length;
    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    this.progressNumber.innerText = `${percentage}%`;

    const circumference = 251;
    const offset = circumference - (percentage / 100) * circumference;
    this.progressCircle.style.strokeDashoffset = offset;
  }

  addTask() {
    const taskName = this.newTaskInput.value.trim();
    this.error.style.display = "none";
    if (!taskName) {
      setTimeout(() => { this.error.style.display = "block"; }, 200);
      return;
    }

    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.innerHTML = `
      <input type="checkbox" class="task-check">
      <span class="taskName">${taskName}</span>
      <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="delete"><i class="fa-solid fa-trash"></i></button>
    `;

    this.taskContainer.appendChild(taskElement);
    this.taskCount++;
    this.displayCount();
    this.newTaskInput.value = "";
    this.updateProgressBar();
  }

  editTask(taskElement) {
    if (this.editingTask && this.editingTask !== taskElement) {
      this.cancelEdit(this.editingTask);
    }
    
    const taskNameSpan = taskElement.querySelector(".taskName");
    const editIcon = taskElement.querySelector(".edit i");
    const deleteIcon = taskElement.querySelector(".delete i");
    const checkBox = taskElement.querySelector(".task-check");
    
    if (!taskNameSpan.isContentEditable) {
      taskNameSpan.setAttribute("data-original", taskNameSpan.innerText);
      taskNameSpan.contentEditable = "true";
      taskNameSpan.focus();
      editIcon.classList.replace("fa-pen-to-square", "fa-check");
      deleteIcon.classList.replace("fa-trash", "fa-xmark");
      checkBox.disabled = true;
      this.editingTask = taskElement;
    } else {
      this.saveEdit(taskElement);
    }
  }

  saveEdit(taskElement) {
    const taskNameSpan = taskElement.querySelector(".taskName");
    const editIcon = taskElement.querySelector(".edit i");
    const deleteIcon = taskElement.querySelector(".delete i");
    const checkBox = taskElement.querySelector(".task-check");
    
    taskNameSpan.contentEditable = "false";
    editIcon.classList.replace("fa-check", "fa-pen-to-square");
    deleteIcon.classList.replace("fa-xmark", "fa-trash");
    checkBox.disabled = false;
    this.editingTask = null;
  }

  cancelEdit(taskElement) {
    const taskNameSpan = taskElement.querySelector(".taskName");
    const editIcon = taskElement.querySelector(".edit i");
    const deleteIcon = taskElement.querySelector(".delete i");
    const checkBox = taskElement.querySelector(".task-check");
    
    taskNameSpan.innerText = taskNameSpan.getAttribute("data-original");
    taskNameSpan.contentEditable = "false";
    editIcon.classList.replace("fa-check", "fa-pen-to-square");
    deleteIcon.classList.replace("fa-xmark", "fa-trash");
    checkBox.disabled = false;
    this.editingTask = null;
  }

  deleteTask(taskElement) {
    if (this.editingTask === taskElement) {
      this.cancelEdit(taskElement);
      return;
    }
    
    const checkBox = taskElement.querySelector(".task-check");
    if (!checkBox.checked) {
      this.taskCount--;
    }
    taskElement.remove();
    this.displayCount();
    this.updateProgressBar();
  }

  toggleTaskCompletion(checkBox) {
    if (this.editingTask) return;
    
    checkBox.nextElementSibling.classList.toggle("completed");
    if (checkBox.checked) {
      this.taskCount--;
    } else {
      this.taskCount++;
    }
    this.displayCount();
    this.updateProgressBar();
  }

  globalClickHandler(event) {
    const taskElement = event.target.closest(".task");
    
    if (this.editingTask && (!taskElement || this.editingTask !== taskElement)) {
      this.cancelEdit(this.editingTask);
    }
    
    if (!taskElement) return;

    if (event.target.closest(".edit")) {
      this.editTask(taskElement);
    } else if (event.target.closest(".delete")) {
      this.deleteTask(taskElement);
    } else if (event.target.matches(".task-check")) {
      this.toggleTaskCompletion(event.target);
    }
  }
}

window.onload = () => new ToDoList();
