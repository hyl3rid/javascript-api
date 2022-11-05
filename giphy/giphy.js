const giphyApiKey = "A44YCAMdh7QI5GWejeFcYrJE0s2N0Sde";

const resultDiv = document.querySelector("#giphy-results");
let submitBtn = document.querySelector(".search-container__btn");
let input = document.querySelector("#search");
input.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    fetchGiphy();
    input.value = "";
  }
});
submitBtn.addEventListener("click", () => {
  fetchGiphy();
  input.value = "";
});

function fetchGiphy() {
  console.log("hi");
  let search = document.querySelector("#search").value;
  const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${search}&limit=12&offset=0&rating=g&lang=en`;
  fetch(giphyUrl)
    .then((response) => response.json())
    .then((data) => {
      loadGiphy(data);
    });
}

function loadGiphy(data) {
  resultDiv.innerHTML = "";
  for (let item of data.data) {
    // console.log(item.images.original.url);
    const resultChild = document.createElement("div");
    resultChild.innerHTML = `
    <div class="giphy-results__container">
      <img class="giphy-results__img" src="${item.images.original.url}"
    </div>
    `;
    const giphyImg = resultChild.querySelector(".giphy-results__img");
    giphyImg.addEventListener("mouseenter", () => {
      giphyImg.classList.add("giphy-results__img--hover");
    });
    giphyImg.addEventListener("mouseleave", () => {
      giphyImg.classList.remove("giphy-results__img--hover");
    });
    resultDiv.appendChild(resultChild);
  }
}
