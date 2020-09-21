AOS.init();
// VARIABLES
const scrollUpBtn = document.querySelector("#scroll-up");
const copyrightEl = document.querySelector("#copyright");
const goDownBtn = document.querySelector("#chevron-down");
const formEl = document.querySelector("#form");
const inputTextEl = document.querySelector("#form-search");
const suggestionsDivEl = document.querySelector("#suggestions");
const preloaderDivEl = document.querySelector('#preloader');
const moreDivEl = document.querySelector("#more");
const lyricsContainerEl = document.querySelector('#lyrics-container');
const cors_api_host = 'https://cors-anywhere.herokuapp.com';
const apiURL = 'https://api.lyrics.ovh/';

// SCROLL DOWN 200 PX ON BTN CLICK
goDownBtn.addEventListener('click', () => {
    window.scroll(0, 200);
});
// SCROLL UP TO TOP OF PAGE ON CLICK
window.onscroll = () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollUpBtn.style.display = "block";
        copyrightEl.style.display = "block";
    } else {
        scrollUpBtn.style.display = "none";
        copyrightEl.style.display = "none";
    }
}
scrollUpBtn.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})
// SHOW SUGGESTED SONGS WHEN SEARCHING SONGS OR ARTIST
formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    let searchTerm = inputTextEl.value.trim();
    if (searchTerm === '') {
        alert('Please add an artist or song title.')
    } else {
        suggestSongs(searchTerm);
        showPreloader(true);
    }

});
// SHOW LYRICS ON BUTTON CLICK
suggestionsDivEl.addEventListener('click', (e) => {
    let clickedEl = e.target;
    if (clickedEl.tagName === 'BUTTON') {
        let artist = clickedEl.getAttribute("data-artist");
        let song = clickedEl.getAttribute("data-song");
        displayLyrics(artist, song);
    }
})


// FUNCTIONS
// GETS SUGGESTED ARTISTS AND SONGS AFTER SEARCH FROM API
async function suggestSongs(searchTerm) {
    try {
        let response = await fetch(`${apiURL}suggest/${searchTerm}/`);
        let data = await response.json();
        displaySongs(data);
        showPreloader(false);

    } catch (error) {
        console.error(`Error: ${error}`);
    }
}
// DISPLAYS ARTIST AND SONGS SUGGESTED TO DOM AND PAGINATION
function displaySongs(data) {
    let newData = data.data;
    let output = '';
    newData.forEach(item => {
        output += ` 
            <div class="suggestions-group-2" data-aos="slide-down" data-aos-delay="50" data-aos-duration="1200">
                <p class="suggestions-p">
                ${item.artist.name} - ${item.title}
                </p>
                <button class="suggestions-btn" data-artist="${item.artist.name}" data-song="${item.title}">Lyrics</button>
            </div>`;
    });
    suggestionsDivEl.innerHTML = output;
    lyricsContainerEl.innerHTML = "";
    // Adds pagination
    if (data.next || data.prev) {

        moreDivEl.innerHTML = `
        ${data.prev ? `<button class="suggestions-btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="suggestions-btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;

    } else {
        moreDivEl.innerHTML = '';
    }
};

// GETS THE NEXT OR PREV SONGS AND DISPLAYS THEM TO DOM
async function getMoreSongs(url) {
    try {
        let response = await fetch(`${cors_api_host}/${url}`);
        let data = await response.json();
        displaySongs(data);

    } catch (error) {
        console.error(`Error: ${error}`);
    }

}

// DISPLAY LYRICS TO DOM
async function displayLyrics(artist, song) {
    try {
        let response = await fetch(`${apiURL}v1/${artist}/${song}`);
        let data = await response.json();
        let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br/>");
        suggestionsDivEl.style.display = "none";
        moreDivEl.style.display = "none";
        lyricsContainerEl.innerHTML = `
            
            <div class="lyrics-group-artist-song">
                <p id="artist"> - ${artist} - </p>
                <p id="song"> - ${song} - </p>
            </div>

            <div id="lyrics" class="lyrics">
                ${lyrics}
            </div>

        `;

    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

// Show preloader
function showPreloader(bool) {
    if (bool) {
        preloaderDivEl.style.display = "flex";
        suggestionsDivEl.style.display = "none";
    } else {
        preloaderDivEl.style.display = "none";
        suggestionsDivEl.style.display = "flex";
    }
}