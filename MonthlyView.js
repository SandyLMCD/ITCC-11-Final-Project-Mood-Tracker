//DISPLAY DATES BUT WITHOUT THE DAY PA
const dateDisplay = document.getElementById("date-display");

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', {month: 'long'});
const currentYear = currentDate.getFullYear();


dateDisplay.innerHTML = `On ${currentMonth} ${currentYear}, <br> I felt...`

//ADD COLORS (for testing) in the first week
const day1 = document.querySelector(".day-1");
day1.classList.add("relaxed");

const day2 = document.querySelector(".day-2");
day2.classList.add("happy");

const day3 = document.querySelector(".day-3");
day3.classList.add("playful");

const day4 = document.querySelector(".day-4");
day4.classList.add("bored");

const day5 = document.querySelector(".day-5");
day5.classList.add("anxious");

const day6 = document.querySelector(".day-6");
day6.classList.add("sad");

const day7 = document.querySelector(".day-7");
day7.classList.add("angry");

//EVENT LISTENER FUNCTION = when clicked, it display on the text content or innerHTML
const dates = document.querySelectorAll(".day");

dates.forEach((date) => {
    date.addEventListener("click", event => {
        const clickedDate = date.textContent;
        console.log(clickedDate);

        const selectedDateImage = document.getElementById("selectedDateImage");
        const selectedDateh1 = document.getElementById("mood-label");

        if(event.target.classList.contains("relaxed")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/relaxed-Photoroom.png">`;
            selectedDateh1.textContent = "Relaxed";
        } else if (event.target.classList.contains("happy")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/happy-Photoroom.png">`;
            selectedDateh1.textContent = "Happy";
        } else if (event.target.classList.contains("playful")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/playful-Photoroom.png">`;
            selectedDateh1.textContent = "Playful";
        } else if (event.target.classList.contains("bored")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/bored-Photoroom.png">`;
            selectedDateh1.textContent = "Bored";
        } else if (event.target.classList.contains("anxious")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/anxious-Photoroom.png">`;
            selectedDateh1.textContent = "Anxious";
        } else if (event.target.classList.contains("sad")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/sad-Photoroom.png">`;
            selectedDateh1.textContent = "Sad";
        } else if (event.target.classList.contains("angry")){
            selectedDateImage.innerHTML = `<img id="selectedDateEmotion" src="emotion-assets/angry-Photoroom.png">`;
            selectedDateh1.textContent = "Angry";
        } else {
            selectedDateImage.innerHTML = ``;
            selectedDateh1.textContent = "";

        }



        dateDisplay.innerHTML = `On ${currentMonth} ${clickedDate}, ${currentYear}, <br> I felt...`
    });
});










