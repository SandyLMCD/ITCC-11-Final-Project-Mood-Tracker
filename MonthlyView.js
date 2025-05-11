//DISPLAY DATES BUT WITHOUT THE DAY PA
const dateDisplay = document.getElementById("date-display");

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', {month: 'long'});
const currentYear = currentDate.getFullYear();


dateDisplay.innerHTML = `On ${currentMonth} ${currentYear}, <br> I felt...`



//EVENT LISTENER FUNCTION = when clicked, it display on the text content or innerHTML
const dates = document.querySelectorAll(".day");

dates.forEach((date) => {
    date.addEventListener("click", () => {
        const clickedDate = date.textContent;
        console.log(clickedDate);

        dateDisplay.innerHTML = `On ${currentMonth} ${clickedDate}, ${currentYear}, <br> I felt...`
    });
});







