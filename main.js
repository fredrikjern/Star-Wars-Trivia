const BASE_URL = "https://swapi.dev/api/";
let character1;
let character2;
let deleteClick = false;
let downloadBtn = document.getElementById("download-button");
downloadBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!deleteClick) {
    deleteClick = true;
    downloadStage();
  } else {
    console.log("Stop clicking you shall");
  }
});
async function downloadStage() {
  let c1 = document.getElementById("character-1").value;
  let c2 = document.getElementById("character-2").value;
  createPictureSection(c1, c2);
    character1 = await createCharacter(c1);
    character2 = await createCharacter(c2);
    character1.createPictureCard();
    character2.createPictureCard();

}

async function createCharacter(string) {
  let { name, gender, height, mass, hairColor, skinColor, eyeColor } =
    await getData(BASE_URL + "people/?search=" + `${string}`);
  let newCharacter = new Character(
    name,
    gender,
    height,
    mass,
    hairColor,
    skinColor,
    eyeColor
  );
  return newCharacter;
}
function createPictureSection() {
  let main = document.querySelector("main");
  let section = document.createElement("section");
  section.id = "picture-section";
  section.innerHTML = `
        <div id="picture-cards">
            
        </div>
        <div><button id="compare-button">Compare</button></div>
        
  `;
  main.append(section);
  let compareButton = document.getElementById("compare-button");
  compareButton.addEventListener("click", (event) => {
    event.preventDefault();
    createCompareSection(character1, character2);
    // character1.createCompareCard();
    // character2.createCompareCard();
  });
}
function createCompareSection(char1, char2) {
  let main = document.querySelector("main");
  let section = document.createElement("section");
  section.id = "compare-section";
  section.innerHTML = `


        <div class="col">
            <div><h3>${char1.name === undefined ? "-" : char1.name}</h3></div>
            <div><p>${char1.gender === undefined ? "-" : char1.gender}</p></div>
            <div><p>${char1.height === undefined ? "-" : char1.height}</p></div>
            <div><p>${char1.mass === undefined ? "-" : char1.mass}</p></div>
            <div><p>${
              char1.hairColor === undefined ? "-" : char1.hairColor
            }</p></div>
            <div><p>${
              char1.skinColor === undefined ? "-" : char1.skinColor
            }</p></div>
            <div><p>${
              char1.eyeColor === undefined ? "-" : char1.eyeColor
            }</p></div>
        </div>
               <div class="col">
        <div class="hidden"><h3>spacer</h2></div>
            <div><p>Gender:</p></div>
            <div><p>Height:</p></div>
            <div><p>Mass:</p></div>
            <div><p>Hair color:</p></div>
            <div><p>Skin color:</p></div>
            <div><p>Eye color:</p></div>
        </div>
        <div class="col">
            <div><h3>${char2.name === undefined ? "-" : char2.name}</h3><div>
            <div><p>${char2.gender === undefined ? "-" : char2.gender}</p></div>
            <div><p>${char2.height === undefined ? "-" : char2.height}</p></div>
            <div><p>${char2.mass === undefined ? "-" : char2.mass}</p></div>
            <div><p>${
              char2.hairColor === undefined ? "-" : char2.hairColor
            }</p></div>
            <div><p>${
              char2.skinColor === undefined ? "-" : char2.skinColor
            }</p></div>
            <div><p>${
              char2.eyeColor === undefined ? "-" : char2.eyeColor
            }</p></div>
        </div>
    `;

  main.append(section);
}

class Character {
  constructor(name, gender, height, mass, hairColor, skinColor, eyeColor) {
    this.name = name;
    this.gender = gender;
    this.height = height;
    this.mass = mass;
    this.hairColor = hairColor;
    this.skinColor = skinColor;
    this.eyeColor = eyeColor;
    this.pictureURL = this.generatePictureUrl();
  }
  getURL() {
    console.log(this.pictureURL);
  }
  generatePictureUrl() {
    return `/assets/${this.name.toLowerCase().replace(/ .*/, "")}.svg`;
  }
  createPictureCard() {
    let pictureCards = document.getElementById("picture-cards");
    pictureCards.classList.add("short");
    let div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
            <div class="picture">
                <div>
                    <img src="${this.pictureURL}" alt="">
                </div>
                <div id="">
                    <h3>${this.name}</h3>
                </div>
            </div>

            <div class="msg">
                <div>
                    <button>Date 1st movie:</button>
                    <button>Both actors</button>
                    <button>Planets</button>
                    <button>$Car</button>
                </div>
                <div>
                    <p>msg container</p>
                </div>
            </div>
        `;
    pictureCards.append(div);
  }
}
let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    let results = json.results;
    console.log(results);
    return results[0];
  } catch (error) {
    console.log(error);
    console.log("Fel i getData");
  }
};
// init
downloadStage()
