//DISPLAY DATES BUT WITHOUT THE DAY PA
const dateDisplay = document.getElementById("date-display");

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString("default", { month: "long" });
const currentYear = currentDate.getFullYear();

dateDisplay.innerHTML = `On ${currentMonth} ${currentYear}, <br> I felt...`;

//EVENT LISTENER FUNCTION = when clicked, it display on the text content or innerHTML
const dates = document.querySelectorAll(".day");

// Get references to the new elements
const addMoodContainer = document.getElementById("add-mood-container");
const addMoodBtn = document.getElementById("addMoodBtn");
let selectedDay = null; // To keep track of which day was clicked

// Update the date click handler
dates.forEach((date) => {
  date.addEventListener("click", (event) => {
    const clickedDate = date.textContent;
    selectedDay = clickedDate; // Store the selected day

    const selectedDateImage = document.getElementById("selectedDateImage");
    const selectedDateh1 = document.getElementById("mood-label");

    if (event.target.classList.contains("relaxed")) {
      selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/relaxed-Photoroom.png">`;
      selectedDateh1.textContent = "Relaxed";
      addMoodContainer.style.display = "none"; // Hide button for days with mood
    }
    // ... keep all your other mood conditions the same ...
    else {
      selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="/emotion-assets/no entry mood-Photoroom.png">`;
      selectedDateh1.textContent = "No mood recorded";
      addMoodContainer.style.display = "block"; // Show button for empty days
    }

    dateDisplay.innerHTML = `On ${currentMonth} ${clickedDate}, ${currentYear}, <br> I felt...`;
  });
});

// Add click handler for the Add Mood button
addMoodBtn.addEventListener("click", () => {
  if (selectedDay) {
    // Store the selected day in localStorage to use in the NewEntry page
    localStorage.setItem("selectedDay", selectedDay);
    // Redirect to the NewEntry page
    window.location.href = "NewEntry.html";
  }
});

// GET CURRENT DAY MOOD FROM LOCAL STORAGE INFO FROM NewEntry
const mood = localStorage.getItem("selectMood");
const day = localStorage.getItem("currentUserDay");

if (mood && day) {
  const targetDivDate = document.querySelector(`.day-${day}`);
  if (targetDivDate) {
    // Clear any existing mood classes
    targetDivDate.classList.remove(
      "relaxed",
      "happy",
      "playful",
      "bored",
      "anxious",
      "sad",
      "angry"
    );
    // Add the new mood class
    targetDivDate.classList.add(mood);
  }
  // Clear the local storage after use
  localStorage.removeItem("selectMood");
  localStorage.removeItem("currentUserDay");
}

// BUTTON TO LOGOUT (but now back to NewEntry lang sa) = TEMPORARY
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  window.location.href = "NewEntry.html";
});

////////////////////////////////////////////////

// Initialize Firebase (make sure this matches your config)
const firebaseConfig = {
  apiKey: "AIzaSyD_M-2M1jB2D-o927BdahbSg7TvEwCjbt8",
  authDomain: "itcc11-moodtracker.firebaseapp.com",
  projectId: "itcc11-moodtracker",
  storageBucket: "itcc11-moodtracker.firebasestorage.app",
  messagingSenderId: "158918242627",
  appId: "1:158918242627:web:a5131444b177195e447ff6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Function to handle logout
function handleLogout() {
  auth
    .signOut()
    .then(() => {
      console.log("User signed out successfully");
      // Redirect to login page after logout
      window.location.href = "/LoginSignUp.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("There was an error logging out. Please try again.");
    });
}

// Function to update user greeting
function updateUserGreeting() {
  const user = auth.currentUser;
  const nameElement = document.querySelector(".name-container h1");

  if (user) {
    // Use displayName if available, otherwise use email (without domain)
    let displayName = user.displayName;
    if (!displayName && user.email) {
      displayName = user.email.split("@")[0];
    }

    if (displayName) {
      nameElement.textContent = `Hello ${displayName}`;
    } else {
      nameElement.textContent = `Hello User`;
    }
  } else {
    // If no user is logged in, redirect to login page
    window.location.href = "/LoginSignUp.html";
  }
}

// Add event listener to logout button
document.addEventListener("DOMContentLoaded", function () {
  // Check auth state when page loads
  auth.onAuthStateChanged((user) => {
    if (user) {
      updateUserGreeting();
    } else {
      window.location.href = "/LoginSignUp.html";
    }
  });

  // Add logout functionality
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor behavior
      handleLogout();
    });
  }
});

///////////////////////////////////////////////

function initializeEmptyCalendar() {
  const allDays = document.querySelectorAll(".day");
  allDays.forEach((day) => {
    day.classList.remove(
      "relaxed",
      "happy",
      "playful",
      "bored",
      "anxious",
      "sad",
      "angry"
    );
  });
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", function () {
  initializeEmptyCalendar();
  // ... rest of your existing DOMContentLoaded code
});
