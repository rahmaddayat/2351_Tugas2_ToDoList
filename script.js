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

  // Tombol Edit
  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((editBtn) => {
    editBtn.addEventListener("click", (e) => {
      const taskElement = editBtn.parentNode;
      const taskNameSpan = taskElement.querySelector(".taskName");
      // Ambil ikon dari tombol edit dan delete
      const editIcon = editBtn.querySelector("i");
      const deleteIcon = taskElement.querySelector(".delete i");

      // Jika belum dalam mode edit, mulai proses edit
      if (!taskNameSpan.isContentEditable) {
        taskNameSpan.setAttribute("data-original", taskNameSpan.innerText);
        taskNameSpan.contentEditable = "true";
        taskNameSpan.focus();

        // Ubah ikon tombol edit dan delete
        editIcon.classList.remove("fa-pen-to-square");
        editIcon.classList.add("fa-check");
        deleteIcon.classList.remove("fa-trash");
        deleteIcon.classList.add("fa-xmark");
      } else {
        // Jika sudah dalam mode edit, selesaikan proses edit dan simpan perubahan
        taskNameSpan.contentEditable = "false";

        // Kembalikan ikon ke kondisi awal
        editIcon.classList.remove("fa-check");
        editIcon.classList.add("fa-pen-to-square");
        deleteIcon.classList.remove("fa-xmark");
        deleteIcon.classList.add("fa-trash");
      }
    });
  });

  // Tombol Delete
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      const taskElement = deleteBtn.parentNode;
      const taskNameSpan = taskElement.querySelector(".taskName");
      // Ambil ikon dari tombol delete dan edit
      const deleteIcon = deleteBtn.querySelector("i");
      const editIcon = taskElement.querySelector(".edit i");

      // Jika task sedang dalam mode edit, batalkan proses edit
      if (taskNameSpan.isContentEditable) {
        // Kembalikan teks asli
        const originalText = taskNameSpan.getAttribute("data-original");
        taskNameSpan.innerText = originalText;
        taskNameSpan.contentEditable = "false";

        // Kembalikan ikon ke kondisi awal
        editIcon.classList.remove("fa-check");
        editIcon.classList.add("fa-pen-to-square");
        deleteIcon.classList.remove("fa-xmark");
        deleteIcon.classList.add("fa-trash");
      } else {
        // Jika tidak dalam mode edit, jalankan fungsi hapus task seperti semula
        const checkBox = taskElement.querySelector(".task-check");
        taskElement.remove();
        // Jika checkbox belum tercentang, maka kurangi taskCount
        if (!checkBox.checked) {
          taskCount -= 1;
        }
        displayCount(taskCount);
        updateProgressBar();
      }
    });
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

// Fungsi untuk membatalkan sesi edit pada sebuah task
const cancelEditing = (taskElement) => {
const taskNameSpan = taskElement.querySelector(".taskName");
  if (taskNameSpan.isContentEditable) {
    const originalText = taskNameSpan.getAttribute("data-original");
    if (originalText !== null) {
      taskNameSpan.innerText = originalText;
    }
    taskNameSpan.contentEditable = "false";

    // Kembalikan ikon ke keadaan semula
    const editIcon = taskElement.querySelector(".edit i");
    const deleteIcon = taskElement.querySelector(".delete i");
    editIcon.className = "fa-solid fa-pen-to-square";
    deleteIcon.className = "fa-solid fa-trash";
  }
};

// Listener pada dokumen untuk mendeteksi klik di luar container task
document.addEventListener("click", (event) => {
  // Jika target adalah checkbox di dalam sebuah task, batalkan sesi edit pada task tersebut
  if (event.target.matches(".task-check")) {
    const taskElement = event.target.closest(".task");
    if (taskElement) {
      cancelEditing(taskElement);
    }
  } else {
    // Jika klik terjadi di luar area task yang sedang dalam mode edit
    document.querySelectorAll(".task").forEach((taskElement) => {
      if (!taskElement.contains(event.target)) {
        cancelEditing(taskElement);
      }
    });
  }
});

window.onload = () => {
  taskCount = 0;
  displayCount(taskCount);
  newTaskInput.value = "";
  updateProgressBar();
};
