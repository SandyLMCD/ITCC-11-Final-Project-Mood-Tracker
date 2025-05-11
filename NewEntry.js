const date = document.querySelector(".date");

const options = {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};


const today = new Date().toLocaleDateString('en-US', options);

date.textContent = `Date: ${today}`;