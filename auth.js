// Initialize Firebase (same as before)
const firebaseConfig = {
  apiKey: "AIzaSyD_M-2M1jB2D-o927BdahbSg7TvEwCjbt8",
  authDomain: "itcc11-moodtracker.firebaseapp.com",
  projectId: "itcc11-moodtracker",
  storageBucket: "itcc11-moodtracker.firebasestorage.app",
  messagingSenderId: "158918242627",
  appId: "1:158918242627:web:a5131444b177195e447ff6",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Error message handler
function showError(formId, message) {
  const form = document.getElementById(formId);
  let errorElement = form.querySelector(".error-message");

  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.className = "error-message";
    form.querySelector("form").appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.style.marginTop = "10px";
}

// Success message handler
function showSuccess(formId, message) {
  const form = document.getElementById(formId);
  let successElement = form.querySelector(".success-message");

  if (!successElement) {
    successElement = document.createElement("p");
    successElement.className = "success-message";
    form.querySelector("form").appendChild(successElement);
  }

  successElement.textContent = message;
  successElement.style.color = "green";
  successElement.style.marginTop = "10px";
}

function loginWithEmail() {
  const email = document.getElementById("wemail").value;
  const password = document.getElementById("wpassword").value;

  // Clear previous messages
  showError("login-form", "");
  showSuccess("login-form", "");

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "/MonthlyView.html";
    })
    .catch((error) => {
      showError("login-form", getFriendlyAuthError(error.code));
    });
}

function registerWithEmail() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Clear previous messages
  showError("register-form", "");
  showSuccess("register-form", "");

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.updateProfile({
        displayName: name,
      });
    })
    .then(() => {
      return auth.signOut();
    })
    .then(() => {
      showSuccess("register-form", "Registration successful! Please log in.");
      setTimeout(() => {
        showForm("login-form");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      }, 2000);
    })
    .catch((error) => {
      showError("register-form", getFriendlyAuthError(error.code));
    });
}

// Register with Email/Password
function registerWithEmail() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Update user profile with display name
      return userCredential.user.updateProfile({
        displayName: name,
      });
    })
    .then(() => {
      // Sign out the newly created user
      return auth.signOut();
    })
    .then(() => {
      // Show success message and redirect to login
      showSuccess("register-form", "Registration successful! Please log in.");
      // Optionally auto-switch to login form after delay
      setTimeout(() => {
        showForm("login-form");
        // Clear the form
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      }, 2000);
    })
    .catch((error) => {
      showError("register-form", getFriendlyAuthError(error.code));
    });
}

// Google Sign-In
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      window.location.href = "/MonthlyView.html";
    })
    .catch((error) => {
      showError("login-form", getFriendlyAuthError(error.code));
    });
}

// Password Reset
function sendPasswordReset() {
  const email = document.getElementById("forgot-email").value;

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      showSuccess(
        "forgot-password-form",
        "Password reset email sent. Check your inbox."
      );
    })
    .catch((error) => {
      showError("forgot-password-form", getFriendlyAuthError(error.code));
    });
}

// Auth state listener
function checkAuthState() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      if (
        window.location.pathname.includes("/LoginSignUp.html") ||
        window.location.pathname.includes("/LoginSignUp.html")
      ) {
        // Only redirect if not on the register form
        if (
          !document.getElementById("register-form").classList.contains("active")
        ) {
          window.location.href = "MonthlyView.html";
        }
      }
    } else {
      // User is logged out
      if (window.location.pathname.includes("/MonthlyView.html")) {
        window.location.href = "/LoginSignUp.html";
      }
    }
  });
}

// Friendly error messages
function getFriendlyAuthError(errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Please enter a valid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "This email is already in use";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/operation-not-allowed":
      return "This operation is not allowed";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    default:
      return "This account does not exist.";
  }
}

// Initialize auth check when page loads
document.addEventListener("DOMContentLoaded", function () {
  checkAuthState();

  // Attach event listeners to forms
  const loginForm = document.querySelector("#login-form form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginWithEmail();
    });

    // Google sign-in button
    const googleBtn = loginForm.querySelector(".btn:nth-of-type(2)");
    if (googleBtn) {
      googleBtn.addEventListener("click", signInWithGoogle);
    }
  }

  const registerForm = document.querySelector("#register-form form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      registerWithEmail();
    });
  }

  const forgotForm = document.querySelector("#forgot-password-form form");
  if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();
      sendPasswordReset();
    });
  }
});

// Error message handler with auto-dismiss
function showError(formId, message) {
  const form = document.getElementById(formId);
  let errorElement = form.querySelector(".error-message");

  // Clear any existing timeout
  if (errorElement && errorElement.timeoutId) {
    clearTimeout(errorElement.timeoutId);
  }

  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.className = "error-message";
    form.querySelector("form").appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.style.marginTop = "10px";

  // Set timeout to clear the message after 5 seconds
  errorElement.timeoutId = setTimeout(() => {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }, 5000);
}

// Success message handler with auto-dismiss
function showSuccess(formId, message) {
  const form = document.getElementById(formId);
  let successElement = form.querySelector(".success-message");

  // Clear any existing timeout
  if (successElement && successElement.timeoutId) {
    clearTimeout(successElement.timeoutId);
  }

  if (!successElement) {
    successElement = document.createElement("p");
    successElement.className = "success-message";
    form.querySelector("form").appendChild(successElement);
  }

  successElement.textContent = message;
  successElement.style.color = "green";
  successElement.style.marginTop = "10px";
  successElement.style.display = "block";

  // Set timeout to clear the message after 5 seconds
  successElement.timeoutId = setTimeout(() => {
    successElement.textContent = "";
    successElement.style.display = "none";
  }, 5000);
}

function showForm(formId) {
  // Clear all messages
  document
    .querySelectorAll(".error-message, .success-message")
    .forEach((element) => {
      element.textContent = "";
      if (element.timeoutId) {
        clearTimeout(element.timeoutId);
      }
    });

  // Hide all forms
  document.getElementById("login-form").classList.remove("active");
  document.getElementById("register-form").classList.remove("active");
  document.getElementById("forgot-password-form").classList.remove("active");

  // Show the requested form
  document.getElementById(formId).classList.add("active");
}
