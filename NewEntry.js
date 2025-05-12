// DISPLAYS CURRENT DATE
const date = document.querySelector(".date");
const options = {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

const today = new Date().toLocaleDateString('en-US', options);
date.textContent = `Date: ${today}`;


// after clicking one of the moods, it stayed scaled to let the user know it is clicked
document.addEventListener("DOMContentLoaded", () => {
const emotionItems = document.querySelectorAll('.emotion-item');

    emotionItems.forEach(item => {
        item.addEventListener('click', () => {
            emotionItems.forEach(i => i.classList.remove('selected'));
            
            item.classList.add('selected');
        });
    }); 
});






// SELECT MOOD :>
function selectMood(mood){
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