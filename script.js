const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const taskContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");
let taskCount = 0;

const displayCount = (count) => {
  countValue.innerText = count;
};

// Fungsi untuk mengupdate progress bar berdasarkan tugas yang selesai
const updateProgressBar = () => {
  const tasks = document.querySelectorAll(".task");
  const totalTasks = tasks.length;
  const completedTasks = document.querySelectorAll(".task-check:checked").length;
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  document.getElementById("number").innerText = `${percentage}%`;

  // Keliling lingkaran dengan radius 40, kira-kira 2 * π * 40 ≈ 251
  const circumference = 251;
  const offset = circumference - (percentage / 100) * circumference;
  document.getElementById("progress-circle").style.strokeDashoffset = offset;
};

const attachTaskEvents = () => {
  // Tombol Hapus
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.onclick = () => {
      const taskElement = button.parentNode;
      const checkBox = taskElement.querySelector(".task-check");

      // Kurangi taskCount jika checkbox belum dicentang
      if (!checkBox.checked) {
        taskCount -= 1;
      }

      taskElement.remove();
      displayCount(taskCount);
      updateProgressBar();
    };
  });

  // Tombol Edit
  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((editBtn) => {
    editBtn.onclick = (e) => {
      let targetElement = e.target;
      if (targetElement.className !== "edit") {
        targetElement = targetElement.parentElement;
      }
      newTaskInput.value = targetElement.previousElementSibling.innerText;
      targetElement.parentNode.remove();
      taskCount-=1;
      displayCount(taskCount);
      updateProgressBar();
    };
  });

  // Checkbox untuk tugas
  const taskChecks = document.querySelectorAll(".task-check");
  taskChecks.forEach((checkBox) => {
    checkBox.onchange = () => {
      checkBox.nextElementSibling.classList.toggle("completed");
      updateProgressBar();
      if (checkBox.checked) {
        taskCount -= 1;
        console.log("checked");
      } else {
        taskCount += 1;
      }
      displayCount(taskCount);
    };
  });
    displayCount(taskCount);
    newTaskInput.value = "";
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";
  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  const task = `<div class="task">
    <input type="checkbox" class="task-check">
    <span class="taskName">${taskName}</span>
    <button class="edit">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`;

  taskContainer.insertAdjacentHTML("beforeend", task);
  taskCount+=1;
  displayCount(taskCount);
  newTaskInput.value = "";
  attachTaskEvents();
  updateProgressBar();
};

addBtn.addEventListener("click", addTask);

window.onload = () => {
  taskCount = 0;
  displayCount(taskCount);
  newTaskInput.value = "";
  updateProgressBar();
};
