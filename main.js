const BASE_URL = "https://swapi.dev/api/";
let character1;
let character2;
let deleteClick = false;
let downloadBtn = document.getElementById("download-button");
downloadBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!deleteClick) {
    let c1 = document.getElementById("character-1").value;
    let c2 = document.getElementById("character-2").value;
    createPictureSection(c1, c2);
    createCharacters(c1, c2);
    deleteClick = true;
  } else {
    console.log("Stop clicking you shall");
  }
});
async function createCharacters(c1, c2) {
  character1 = await createCharacter(c1);
  character2 = await createCharacter(c2);
  character1.createPictureCard(true);
  character2.createPictureCard(false);
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
  section.id = "picture-cards";
  section.innerHTML = `
        <div></div>
        <div><button id="compare-button">Compare</button></div>
        <div></div>
  `;
  main.append(section);
  setTimeout(() => {
    let compareButton = document.getElementById("compare-button");
    compareButton.addEventListener("click", (event) => {
      event.preventDefault();
      createCompareSection()
        character1.createCompareCard();
        character2.createCompareCard();
    });
  }, 500);
}
function createCompareSection() {
  let main = document.querySelector("main");
  let section = document.createElement("section");
  section.id = "compare-section";
  main.append(section);
}

let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    let results = json.results;
    return results[0];
  } catch (error) {
    console.log(error);
    console.log("Fel i getData");
  }
};

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
  createPictureCard(first) {
    let pictureCards = document.getElementById("picture-cards");
    let div = document.createElement("div");
    div.innerHTML = `
        <div class="card" >
            <img src="${this.pictureURL}" alt="">
            <div id="">
                <h3>${this.name}</h3>
            </div>
        </div>
        `;
    first ? pictureCards.prepend(div) : pictureCards.append(div);
  }
  createCompareCard() {
    let compareSection = document.getElementById("compare-section");
    let div = document.createElement("div");
    div.innerHTML = `
        <div class="card" >
       <div><h3>Gender: ${this.gender === undefined ? " " : this.gender}</h3></div>
       <div><h3>Height: ${this.height === undefined ? " " : this.height}</h3></div>
       <div><h3>Mass: ${this.mass === undefined ? " " : this.mass}</h3></div>
       <div><h3>Hair color:${
         this.hairColor === undefined ? " " : this.hairColor
       }</h3></div>
       <div><h3>Skin color: ${
         this.skinColor === undefined ? " " : this.skinColor
       }</h3></div>
       <div><h3>Eye color:${this.eyeColor === undefined ? " " : this.eyeColor}</h3></div>
        </div>
        `;
    compareSection.append(div)

  }
}
