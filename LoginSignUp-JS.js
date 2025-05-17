function showForm(formId) {
  document.getElementById("login-form").classList.remove("active");
  document.getElementById("register-form").classList.remove("active");
  document.getElementById("forgot-password-form").classList.remove("active");
  document.getElementById(formId).classList.add("active");
}
