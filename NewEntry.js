// DISPLAYS CURRENT DATE
const date = document.querySelector(".date");
const options = {
  timeZone: "Asia/Singapore",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const today = new Date().toLocaleDateString("en-US", options);
date.textContent = `Date: ${today}`;

// after clicking one of the moods, it stayed scaled to let the user know it is clicked
document.addEventListener("DOMContentLoaded", () => {
  const emotionItems = document.querySelectorAll(".emotion-item");

  emotionItems.forEach((item) => {
    item.addEventListener("click", () => {
      emotionItems.forEach((i) => i.classList.remove("selected"));

      item.classList.add("selected");
    });
  });
});

// SELECT MOOD :>
function selectMood(mood) {
  localStorage.setItem("selectMood", mood);
  console.log(mood);

  const date = new Date().getDate();
  localStorage.setItem("currentUserDay", date);
  console.log(date);
}

// BUTTON TO GO TO MONTHLYVIEW(??) im not sure = TEMPORARY
const saveEntryBtn = document.getElementById("saveEntryBtn");
saveEntryBtn.addEventListener("click", () => {
  window.location.href = "MonthlyView.html";
});

// Function to handle cancel button click
function handleCancel() {
  // Check if we came from a specific day selection
  const selectedDay = localStorage.getItem("selectedDay");

  // Clear any temporary storage
  localStorage.removeItem("selectedDay");
  localStorage.removeItem("selectMood");
  localStorage.removeItem("currentUserDay");

  // Redirect back to Monthly View
  window.location.href = "MonthlyView.html";
}

// Add event listener for cancel button (alternative to onclick in HTML)
document.addEventListener("DOMContentLoaded", function () {
  // You can use this instead of the onclick attribute if you prefer
  const cancelButton = document.querySelector(".cancel-button");
  if (cancelButton) {
    cancelButton.addEventListener("click", handleCancel);
  }

  // Rest of your existing DOMContentLoaded code...
});

// Update the date display
function updateDateDisplay() {
  const dateElement = document.querySelector(".date");
  if (dateElement) {
    const today = new Date();
    const selectedDay = localStorage.getItem("selectedDay");

    // Use selected day if coming from monthly view, otherwise use today's date
    const dayToShow = selectedDay || today.getDate();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    dateElement.textContent = `Date: ${month} ${dayToShow}, ${year}`;
  }
}

// Call this in your DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  updateDateDisplay();
  // ... rest of your initialization code
});

////////////////////////////////////////////////////////////

// In NewEntry.js
document
  .getElementById("saveEntryBtn")
  .addEventListener("click", saveMoodEntry);

function saveMoodEntry() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save your mood");
    return;
  }

  const selectedMood = localStorage.getItem("selectMood");
  if (!selectedMood) {
    alert("Please select a mood first");
    return;
  }

  const today = new Date();
  const selectedDay = localStorage.getItem("selectedDay");
  const dayToSave = selectedDay ? parseInt(selectedDay) : today.getDate();
  const month = today.getMonth() + 1; // Months are 0-indexed
  const year = today.getFullYear();
  const dateString = `${year}-${month.toString().padStart(2, "0")}-${dayToSave
    .toString()
    .padStart(2, "0")}`;

  // Create mood entry object
  const moodEntry = {
    userId: user.uid,
    mood: selectedMood,
    date: dateString,
    day: dayToSave,
    month: month,
    year: year,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  // Add to Firestore
  db.collection("moodEntries")
    .add(moodEntry)
    .then(() => {
      console.log("Mood entry saved successfully");
      // Clear local storage
      localStorage.removeItem("selectMood");
      localStorage.removeItem("selectedDay");
      // Redirect to monthly view
      window.location.href = "MonthlyView.html";
    })
    .catch((error) => {
      console.error("Error saving mood entry: ", error);
      alert("There was an error saving your mood. Please try again.");
    });
}
