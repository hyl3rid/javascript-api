const clientId = "697f0d624329462ba4e351ab2c69e4c3";
const clientSecret = "4122a50bf18e450f859faa74edaeb27c";

let resultsDiv = document.querySelector("#search-results");
let submitBtn = document.querySelector(".search-container__btn");
let input = document.querySelector("#search");

input.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    console.log("test");
    authorizeToSpotify();
  }
});
submitBtn.addEventListener("click", () => {
  authorizeToSpotify();
});

function authorizeToSpotify() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://accounts.spotify.com/api/token", true);
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    "Basic " + btoa(clientId + ":" + clientSecret)
  );

  xhr.onreadystatechange = function () {
    //Call a function when the state changes.
    if (xhr.readyState == 4 && xhr.status == 200) {
      searchSong(JSON.parse(xhr.responseText).access_token);
    }
    return false;
  };
  xhr.send("grant_type=client_credentials");
}

function searchSong(token) {
  let xhr = new XMLHttpRequest();

  let search = document.querySelector(".search-container__input").value;

  resultsDiv.innerHTML = "";
  xhr.open(
    "GET",
    `https://api.spotify.com/v1/search?q=${search}&type=track&limit=10`
  );
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    //Call a function when the state changes.
    if (xhr.status == 200 && xhr.readyState === 4) {
      loadContent(xhr);
    }
    return false;
  };

  xhr.send();
  input.value = "";
}

function loadContent(xhr) {
  let response = JSON.parse(xhr.responseText);
  // console.log(response);
  // console.log(response.tracks.items[0].album.images[0].url);

  for (var i = 0; i < response.tracks.items.length; i++) {
    let track = response.tracks.items[i];

    elChild = document.createElement("div");
    elChild.innerHTML = `
    <div class="display-song-container" data-track="
    ${track.id}
    ">
    <div id="display-song-container__wrapper${i}" class="display-song-container__wrapper">
      <svg id="play-icon${i}" class="display-song-container__icons display-song-container__icons--play-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 485 485" style="enable-background:new 0 0 485 485;" xml:space="preserve">
        <g>
          <path fill="white" d="M413.974,71.026C368.171,25.225,307.274,0,242.5,0S116.829,25.225,71.026,71.026C25.225,116.829,0,177.726,0,242.5
            s25.225,125.671,71.026,171.474C116.829,459.775,177.726,485,242.5,485s125.671-25.225,171.474-71.026
            C459.775,368.171,485,307.274,485,242.5S459.775,116.829,413.974,71.026z M242.5,455C125.327,455,30,359.673,30,242.5
            S125.327,30,242.5,30S455,125.327,455,242.5S359.673,455,242.5,455z"/>
          <polygon fill="white" points="181.062,336.575 343.938,242.5 181.062,148.425 	"/>
        </g>
      </svg>
      <svg id="pause-icon${i}" class="display-song-container__icons display-song-container__icons--pause-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 485 485" style="enable-background:new 0 0 485 485;" xml:space="preserve">
        <g>
          <path fill="white" d="M413.974,71.026C368.171,25.225,307.274,0,242.5,0S116.829,25.225,71.026,71.026C25.225,116.829,0,177.726,0,242.5
            s25.225,125.671,71.026,171.474C116.829,459.775,177.726,485,242.5,485s125.671-25.225,171.474-71.026
            C459.775,368.171,485,307.274,485,242.5S459.775,116.829,413.974,71.026z M242.5,455C125.327,455,30,359.673,30,242.5
            S125.327,30,242.5,30S455,125.327,455,242.5S359.673,455,242.5,455z"/>
          <rect fill="white" x="172.5" y="140" width="55" height="205"/>
          <rect fill="white" x="257.5" y="140" width="55" height="205"/>
        </g>
      </svg>
      <video id="video${i}" class="display-song-container__image-album" name="media" poster="${response.tracks.items[i].album.images[0].url}">
       <source src="${response.tracks.items[i].preview_url}" type="audio/mpeg">
      </video>
    </div>  
    <p class="display-song-container__description">
    ${track.artists[0].name}
    -
    ${track.name}
    </p>
    </div>
    `;
    resultsDiv.appendChild(elChild);
    const wrapper = document.querySelector(
      `#display-song-container__wrapper${i}`
    );
    const video = wrapper.querySelector(`#video${i}`);
    const playIcon = wrapper.querySelector(`#play-icon${i}`);
    const pauseIcon = wrapper.querySelector(`#pause-icon${i}`);
    loadVideoControls(video, wrapper, playIcon, pauseIcon);
  }
}

// PLAYER
function loadVideoControls(video, wrapper, playIcon, pauseIcon) {
  wrapper.addEventListener("click", (e) => {
    let timer;
    if (timer) {
      clearInterval(timer);
    }

    let videoPlaying = [false, null];

    if (videoPlaying[0] || video.paused || video.ended) {
      if (videoPlaying[1]) {
        prevVideo = videoPlaying[1];
        console.log(prevVideo);
        prevVideo.pause();
      }
      video.play();
      playIcon.style.opacity = 0;
      pauseIcon.style.opacity = 1;
      videoPlaying = [true, video];
    } else {
      video.pause();
      playIcon.style.opacity = 1;
      pauseIcon.style.opacity = 0;

      timer = setTimeout(() => {
        pauseIcon.style.opacity = "";
        playIcon.style.opacity = "";
      }, 2000);
    }
  });

  video.addEventListener("ended", (e) => {
    pauseIcon.style.opacity = "";
    playIcon.style.opacity = "";
  });
}
