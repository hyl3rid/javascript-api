const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/`;
const resultDiv = document.querySelector("#poke-results");
const submitBtn = document.querySelector(".search-container__btn");
const input = document.querySelector("#search");
const pagination = document.querySelector("#pagination");
const catchEmBtn = document.querySelector(".search-container__btn--catch-em");
let offset = 0;
let limit = 6;
let params = `?limit=${limit}&offset=${offset}`;
let countG = 0;
let currentPage = 0;

pagination.addEventListener("click", (e) => {
  let search = document.querySelector("#search").value;
  if (e.target.innerHTML === "&lt;") {
    if (offset > 0) {
      offset = offset - 6;
      currentPage--;
    }
  } else if (e.target.innerHTML === "&gt;") {
    if (currentPage < countG / 6 - 5) {
      offset = offset + 6;
      currentPage++;
    }
  } else if (String(e.target.innerHTML).trim() === "&lt;&lt;") {
    offset = 0;
    currentPage = 0;
  } else if (String(e.target.innerHTML).trim() === "&gt;&gt;") {
    console.log("yo!" + countG);
    console.log(": " + (countG % 6));
    offset = countG - (countG % 6);
    console.log(offset);
    currentPage = Math.ceil(countG / 6) - 5;
  }
  params = `?limit=${limit}&offset=${offset}`;
  let url = pokeApiUrl + search + params;
  fetchPoke(search, url);
});

input.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    let search = document.querySelector("#search").value;
    fetchPoke(search);
    input.value = "";
  }
});

submitBtn.addEventListener("click", () => {
  let search = document.querySelector("#search").value;
  fetchPoke(search);
  input.value = "";
});

catchEmBtn.addEventListener("click", () => fetchPoke(""));

async function fetchPoke(
  searchString,
  url = pokeApiUrl + params,
  shouldGenerateBtn = true
) {
  if (searchString) {
    url = pokeApiUrl + searchString + params;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (searchString === "") {
        loadPokeAll(data);
        if (shouldGenerateBtn) {
          generateBtn(data.count);
          return;
        }
        count = data.count;
      }
      loadPoke(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// console.log("c: " + count);

function loadPoke(data) {
  resultDiv.innerHTML = "";

  document.querySelector("#pagination").classList.add("pagination--hide");

  document
    .querySelector("#poke-results")
    .classList.remove("search-container__results--all");
  const resultChild = document.createElement("div");

  resultChild.innerHTML = `
      <section class="poke-results__container">
       <img class="poke-results__img" src="${
         data.sprites.other["official-artwork"].front_default
       }">
        <div class="poke-results__text-container">
          <h2 class="poke-results__name">${
            data.name[0].toUpperCase() + data.name.slice(1, data.name.length)
          }</h2>
          <div class="poke-results__text">
            <div>
              <span class="poke-results__title-item">Abilities</span>
              <ul>
                ${data.abilities
                  .map(
                    (item) =>
                      `<li class="poke-results__list-item">${
                        item.ability.name[0].toUpperCase() +
                        item.ability.name.slice(1, item.ability.name.length)
                      }</li>`
                  )
                  .join()
                  .replaceAll(",", "")}
              </ul>
            </div>
            <div>
              <span class="poke-results__title-item">Attributes</span>
              <ul>
                <li class="poke-results__list-item">Height: ${data.height}</li>
                <li class="poke-results__list-item">Weight: ${data.weight}</li>
              </ul>
            </div>
            <div>
              <span class="poke-results__title-item">Stats</span>
              <ul>
                ${data.stats
                  .map(
                    (item) =>
                      `<li class="poke-results__list-item">${item.stat.name}: ${item.base_stat}</li>`
                  )
                  .join()
                  .replaceAll(",", "")}
              </ul>
            </div>
            <div>
              <span class="poke-results__title-item">Type</span>
              <ul>
                ${data.types
                  .map(
                    (item) =>
                      `<li class="poke-results__list-item">${
                        item.type.name[0].toUpperCase() +
                        item.type.name.slice(1, item.type.name.length)
                      }</li>`
                  )
                  .join()
                  .replaceAll(",", "")}
              </ul>
            </div>
          </div>
        </div>
        <div class="pagination">
      </section>
    `;

  resultDiv.appendChild(resultChild);
}

function loadPokeAll(data) {
  document.querySelector("#pagination").classList.remove("pagination--hide");

  resultDiv.innerHTML = "";
  console.log(data);
  for (let result of data.results) {
    fetch(result.url)
      .then((response) => response.json())
      .then((data) => {
        const resultChild = document.createElement("div");
        resultChild.innerHTML = `
              <div class="poke-results-all__container">
                <img class="poke-results-all__img" src="${
                  data.sprites.other["official-artwork"].front_default
                }"> 
                <h2 class="poke-results__name">${
                  data.name[0].toUpperCase() +
                  data.name.slice(1, data.name.length)
                }</h2>
              </div>
            `;
        resultChild.addEventListener("click", () => {
          fetchPoke(data.name);
        });
        document
          .querySelector("#poke-results")
          .classList.add("search-container__results--all");
        resultDiv.appendChild(resultChild);
      });
  }
}

function generateBtn(count) {
  let numPages = Math.ceil(count / 6);
  countG = count;
  const btnContainer = document.querySelector(".pagination__btn-generator");
  btnContainer.innerHTML = "";
  if (numPages > 7) {
    for (let i = 1; i < 6; i++) {
      console.log("calc: " + Number(offset / 6 + 1));
      let btn = document.createElement("div");

      btn.innerHTML += `
        <button class="pagination__btn pagination__btn--numbered">${
          i + currentPage
        }</button>
      `;
      btnContainer.appendChild(btn);
    }
    let selectBtn = document.querySelectorAll(".pagination__btn--numbered");
    for (let btn of selectBtn) {
      btn.addEventListener("click", (e) => {
        offset = 6 * e.target.innerHTML - 6;
        params = `?limit=${limit}&offset=${offset}`;
      });
    }
  } else {
    for (let i = 0; i < numPages; i++) {
      btn.innerHTML = `
          <button>${i}</button>
        `;
    }
    btnContainer.appendChild(btn);
  }
}
