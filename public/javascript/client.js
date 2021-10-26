const next1 = document.querySelector(".next1");
const next2 = document.querySelector(".next2");
const inputAndLabel = document.querySelector(".inputAndLabel");
const inputAndLabel1 = document.querySelector(".inputAndLabel1");
const inputAndLabel2 = document.querySelector(".inputAndLabel2");
const inputAndLabelButton = document.querySelector(".inputAndLabelButton");

next1.addEventListener("click" , () => {
    inputAndLabel1.classList.add("inputAndLabelFunction");
    next1.style.display = "none";
    next2.style.display = "block";
    inputAndLabel.style.height = "fit-content"
    inputAndLabel2.style.height = "fit-content"
})
next2.addEventListener("click" , () => {
    inputAndLabel2.classList.add("inputAndLabelFunction");
    inputAndLabelButton.classList.add("inputAndLabelFunction");
    next2.style.display = "none";
})