console.log("MonthlyView.js loaded");

const dateDisplay = document.getElementById("date-display");

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString("default", { month: "long" });
const currentYear = currentDate.getFullYear();

dateDisplay.innerHTML = `On ${currentMonth} ${currentYear}, <br> I felt...`;

////////////////////////////////////////////////

// Handle Add Mood button click
addMoodBtn.addEventListener("click", () => {
  if (selectedDay) {
    // Store the selected day to use in NewEntry page
    localStorage.setItem("selectedDay", selectedDay);
    // Redirect to NewEntry page
    window.location.href = "NewEntry.html";
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

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
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
  const logoutBtn = document.getElementById("logoutBtn");
  let selectedDay = null;
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;

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

  // Add click handler for the Add Mood button
  addMoodBtn.addEventListener("click", () => {
    if (selectedDay) {
      // Store the selected day in localStorage to use in the NewEntry page
      localStorage.setItem("selectedDay", selectedDay);
      // Redirect to the NewEntry page
      window.location.href = "NewEntry.html";
    }
  });

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
    console.log("loadUserMoods called, user:", user);
    if (!user) return;

    db.collection("moodEntries")
      .where("userId", "==", user.uid)
      .where("month", "==", currentMonthNum)
      .where("year", "==", currentYear)
      .orderBy("day")
      .get()
      .then((querySnapshot) => {
        console.log("Number of moods loaded:", querySnapshot.size);
        querySnapshot.forEach((doc) => {
          const moodData = doc.data();
          console.log("Loaded moodData:", moodData);
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
      console.log(`Setting mood for day ${day}: ${mood}`);
      dayElement.classList.remove(
        "relaxed",
        "happy",
        "playful",
        "bored",
        "anxious",
        "sad",
        "angry"
      );
      dayElement.classList.add(mood);
    } else {
      console.warn(`No element found for .day-${day}`);
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

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      auth
        .signOut()
        .then(() => (window.location.href = "LoginSignUp.html"))
        .catch((error) => console.error("Logout error:", error));
    });
  }
});
