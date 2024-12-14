const openModalButton = document.getElementById("openModalButton");
const signupCard = document.getElementById("signupCard");
const overlay = document.getElementById("overlay");

// Open the modal when the button is clicked
openModalButton.addEventListener("click", function () {
  signupCard.classList.add("active");
  overlay.classList.add("active");
});

// Close the modal when the overlay is clicked
overlay.addEventListener("click", function () {
  signupCard.classList.remove("active");
  overlay.classList.remove("active");
});
