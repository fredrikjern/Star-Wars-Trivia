const BASE_URL = "https://swapi.dev/api/";

let downloadBtn = document.getElementById("download-button");
downloadBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let c1 = document.getElementById("character-1").value;
  let c2 = document.getElementById("character-2").value;
  createCharacters(c1, c2)
});
async function createCharacters(c1, c2) {
  let character1 = await createCharacter(c1);
  let character2 = await createCharacter(c2);
console.log(character1);
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
  //renderDropdowns(results);
}
// function renderDropdowns(characters) {
//   let i = 0;
//   //let char1dropdown = document.getElementById("character-1-dropdown");
//   characters.forEach((character) => {
//     console.log(character.name + " " + i);
//     i++;
//   });
// }
// function drawDropdown(params) {}

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
  }
  getMass() {
    console.log(this.mass);
  }
  getGender() {}
}
