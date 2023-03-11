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
  character1 = await createCharacter(c1);
  character2 = await createCharacter(c2);
  character1.addPictureCard();
    character2.addPictureCard();
    character1.compareRender(character2)
    character1.compareTo(character2);
    console.log("slut");
}

function compareEventlistener() {
  let compareButton = document.getElementById("compare-button");
  compareButton.addEventListener("click", (event) => {
    event.preventDefault();
   character1.compareRender();
    // character2.createCompareCard();
  });
}

// !----------------

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
  //*Methods
  generatePictureUrl() {
    return `/assets/${this.name.toLowerCase().replace(/ .*/, "")}.svg`;
  }
  addPictureCard() {
    let pictureCards = document.querySelector(".picture-cards");
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
  compareRender(char2) {
    let compareSection = document.querySelector(".compare-section");
    compareSection.innerHTML = `
        <div class="col">
            <div><h3>${this.name === undefined ? "-" : this.name}</h3></div>
            <div><p>${this.gender === undefined ? "-" : this.gender}</p></div>
            <div><p>${this.height === undefined ? "-" : this.height}</p></div>
            <div><p>${this.mass === undefined ? "-" : this.mass}</p></div>
            <div><p>${
              this.hairColor === undefined ? "-" : this.hairColor
            }</p></div>
            <div><p>${
              this.skinColor === undefined ? "-" : this.skinColor
            }</p></div>
            <div><p>${
              this.eyeColor === undefined ? "-" : this.eyeColor
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
  }
  compareTo(char) {
    if (this.height === char) {
    }
  }
}
// ?Färdiga helpers

let createCharacter = async (string) => {
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
};
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
downloadStage();
