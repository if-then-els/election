
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
   const type = passwordInput.type === "password" ? "text" : "password";
   passwordInput.type = type;
   
   // Toggle the eye / eye-slash icon
   this.classList.toggle("fa-eye");
   this.classList.toggle("fa-eye-slash");
});
