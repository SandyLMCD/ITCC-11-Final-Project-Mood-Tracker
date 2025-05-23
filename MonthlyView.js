//DISPLAY DATES BUT WITHOUT THE DAY PA
const dateDisplay = document.getElementById("date-display");

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString("default", { month: "long" });
const currentYear = currentDate.getFullYear();

dateDisplay.innerHTML = `On ${currentMonth} ${currentYear}, <br> I felt...`;

//EVENT LISTENER FUNCTION = when clicked, it display on the text content or innerHTML
// const dates = document.querySelectorAll(".day");

// Get references to the new elements
// let selectedDay = null; // To keep track of which day was clicked (removed duplicate)

// Update the date click handler
// dates.forEach((date) => {
//   date.addEventListener("click", (event) => {
//     const clickedDate = date.textContent;
//     selectedDay = clickedDate; // Store the selected day

//     const selectedDateImage = document.getElementById("selectedDateImage");
//     const selectedDateh1 = document.getElementById("mood-label");

//     if (event.target.classList.contains("relaxed")) {
//       selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/relaxed-Photoroom.png">`;
//       selectedDateh1.textContent = "Relaxed";
//       addMoodContainer.style.display = "none"; // Hide button for days with mood
//     }
//     // ... keep all your other mood conditions the same ...
//     else {
//       selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="/emotion-assets/no entry mood-Photoroom.png">`;
//       selectedDateh1.textContent = "No mood recorded";
//       addMoodContainer.style.display = "block"; // Show button for empty days
//     }

//     dateDisplay.innerHTML = `On ${currentMonth} ${clickedDate}, ${currentYear}, <br> I felt...`;
//   });
// });

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

// // BUTTON TO LOGOUT (but now back to NewEntry lang sa) = TEMPORARY
// const logoutBtn = document.getElementById("logoutBtn");
// logoutBtn.addEventListener("click", () => {
//   window.location.href = "NewEntry.html";
// });

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
const db = firebase.firestore();

const dateDisplay = document.getElementById("date-display");
const selectedDateImage = document.getElementById("selectedDateEmotion");
const moodLabel = document.getElementById("mood-label");
const addMoodContainer = document.getElementById("add-mood-container");
const addMoodBtn = document.getElementById("addMoodBtn");
let selectedDay = null; // Keep this as the only declaration
const currentMonthNum = currentDate.getMonth() + 1; // Months are 0-indexed

// Initialize the calendar
function initializeCalendar() {
  initializeEmptyCalendar();
  // Set initial display text
  dateDisplay.innerHTML = `On ${currentMonth} ${currentYear}, <br> I felt...`;

  // Load user's moods for current month
  loadUserMoods();

  // Set up day click handlers
  setupDayClickHandlers();
}

// Load user's mood entries for current month
function loadUserMoods() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("moodEntries")
    .where("userId", "==", user.uid)
    .where("month", "==", currentMonthNum)
    .where("year", "==", currentYear)
    .orderBy("day")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const moodData = doc.data();
        updateCalendarDay(moodData.day, moodData.mood);
      });
    })
    .catch((error) => {
      console.error("Error loading moods: ", error);
    });
}

// Update a specific day in the calendar with mood
function updateCalendarDay(day, mood) {
  const dayElement = document.querySelector(`.day-${day}`);
  if (dayElement) {
    // Clear any existing mood classes
    dayElement.classList.remove(
      "relaxed",
      "happy",
      "playful",
      "bored",
      "anxious",
      "sad",
      "angry"
    );
    // Add the new mood class
    dayElement.classList.add(mood);
  }
}

// Set up click handlers for each day
function setupDayClickHandlers() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", () => {
      selectedDay = day.textContent;
      updateSelectedDayDisplay(day);
    });
  });
}

// Update the right panel when a day is selected
function updateSelectedDayDisplay(dayElement) {
  console.log("Clicked day:", dayElement.textContent); // Add this line
  const clickedDay = dayElement.textContent;

  // Update the date display
  dateDisplay.innerHTML = `On ${currentMonth} ${clickedDay}, ${currentYear}, <br> I felt...`;

  // Check if day has a mood
  const hasMood = [
    "relaxed",
    "happy",
    "playful",
    "bored",
    "anxious",
    "sad",
    "angry",
  ].some((mood) => dayElement.classList.contains(mood));

  if (hasMood) {
    // Find which mood class is present
    const mood = [
      "relaxed",
      "happy",
      "playful",
      "bored",
      "anxious",
      "sad",
      "angry",
    ].find((mood) => dayElement.classList.contains(mood));

    // Update display with the mood
    selectedDateImage.src = `emotion-assets/${mood}-Photoroom.png`;
    moodLabel.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    addMoodContainer.style.display = "none";
  } else {
    // No mood recorded for this day
    selectedDateImage.src = "emotion-assets/no entry mood-Photoroom.png";
    moodLabel.textContent = "No mood recorded";
    addMoodContainer.style.display = "block";
  }
}

// Handle Add Mood button click
addMoodBtn.addEventListener("click", () => {
  if (selectedDay) {
    // Store the selected day to use in NewEntry page
    localStorage.setItem("selectedDay", selectedDay);
    // Redirect to NewEntry page
    window.location.href = "NewEntry.html";
  }
});

// Handle logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth
    .signOut()
    .then(() => (window.location.href = "LoginSignUp.html"))
    .catch((error) => console.error("Logout error:", error));
});

// Check auth state and initialize
auth.onAuthStateChanged((user) => {
  if (user) {
    // Update user greeting
    const nameElement = document.querySelector(".name-container h1");
    const displayName = user.displayName || user.email.split("@")[0] || "User";
    nameElement.textContent = `Hello ${displayName}`;

    // Initialize calendar
    initializeCalendar();
  } else {
    // Redirect to login if not authenticated
    window.location.href = "LoginSignUp.html";
  }
});

///////////////////////////////////////////

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

// Add logout functionality
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    handleLogout();
  });
}

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

document.addEventListener("DOMContentLoaded", function () {
  // Place all your initialization code here, e.g.:
  auth.onAuthStateChanged((user) => {
    if (user) {
      const nameElement = document.querySelector(".name-container h1");
      const displayName =
        user.displayName || user.email.split("@")[0] || "User";
      nameElement.textContent = `Hello ${displayName}`;
      initializeCalendar();
    } else {
      window.location.href = "LoginSignUp.html";
    }
  });
});
