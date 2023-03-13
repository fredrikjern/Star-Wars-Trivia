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
  //console.log(await getData(BASE_URL + "people/?search="));
  character1 = await createCharacter(
    document.getElementById("character-1").value
  );
  character2 = await createCharacter(
    document.getElementById("character-2").value
  );
  character1.addPictureCard();
  character2.addPictureCard();

  character1.compareRender(character2);
  //console.log(await character1.vehicles);
  //console.log(await character1.starships);
  console.log(await character2.vehicles);
  console.log(await character2.starships);
}

let compareButton = document.getElementById("compare-button");
compareButton.addEventListener("click", (event) => {
  event.preventDefault();
  let compareSection = document.querySelector(".compare-section");
  compareSection.classList.toggle("none");
  console.log("jkux");
});

// !----------------

class Character {
  constructor(
    name,
    gender,
    height,
    mass,
    hair_color,
    skin_color,
    eye_color,
    films,
    homeworld,
    vehicles,
    starships
  ) {
    this.name = name;
    this.films = this.getFilms(films);
    this.nFilms = films.length;
    this.gender = gender;
    this.height = Number(height);
    this.mass = Number(mass);
    this.hair_color = hair_color;
    this.skin_color = skin_color;
    this.eye_color = eye_color;
    this.homeworld = this.getPlanet(homeworld);
    this.starships = this.getVehicles(starships);
    this.vehicles = this.getVehicles(vehicles);
    this.pictureURL = this.generatePictureUrl();
  }
  //*         Methods
  printMostExpensiveVehicle = async () => {
    console.log("klick");
    let v= await this.starships;
    this.printToCardMsg(`<h3>${this.name}'s most expensive vehicle is:</h3>
    <p>Model:${v[0][0]}</p>
    <p>Name:${v[0][1]}</p>
    <p>Price: ${v[0][2]} space dollars</p>
     `);
  };
  getVehicles = async (url) => {
    let vehicles = await this.getMultiple(url);
    //console.log(vehicles);
    let veArr = vehicles.map((vehicle) => {
      let { model, name, cost_in_credits } = vehicle.value;
      return [model, name, cost_in_credits];
    });
    console.log(veArr);
    veArr.sort((a, b) => {
      const aPrice = a[2] === "unknown" ? 0 : parseInt(a[2]);
      const bPrice = b[2] === "unknown" ? 0 : parseInt(b[2]);
      return bPrice - aPrice;
    });

    return veArr;
  };
  compareFilms = async (char2) => {
    let f1 = await this.films;
    let f2 = await char2.films;
    const similarValues = f1
      .map((value) => {
        const [movie, date] = value;
        const match = f2.find(
          ([f2Movie, f2Date]) => f2Movie === movie && f2Date === date
        );
        if (match) return value;
      })
      .filter((value) => value !== undefined);
    if (similarValues) {
      let text = [];
      similarValues.forEach((val) => {
        let movie = `${val[0]} (${val[1].match(/^.{4}/)})<br>`;
        text.push(movie);
      });

      this.printToCardMsg(`Both characters appear in:<br>${text}`);
    } else {
      this.printToCardMsg("The characters never appear in the same movie");
    }
  };
  compareHomePlanet = async (char2) => {
    if ((await this.homeworld) === (await char2.homeworld)) {
      this.printToCardMsg(`Both characters are from ${await char2.homeworld}`);
    } else {
      this.printToCardMsg(`${this.name} is from ${await this.homeworld}`);
    }
  };
  printToCardMsg(string) {
    let msgContainer = document.querySelector(".message-container");
    msgContainer.innerHTML = `${string}`;
  }
  printFirstMovie = async () => {
    let arr = await this.films;
    this.printToCardMsg(
      `${this.name} first appeared in ${arr[0][0]} in ${arr[0][1].match(
        /^.{4}/
      )}`
    );
  };
  getFilms = async (arr) => {
    let films = await this.getMultiple(arr);
    let titleDate = films.map((film) => {
      return [film.value.title, film.value.release_date];
    });
    return titleDate;
  };
  getMultiple = async (arr) => {
    try {
      let promises = arr.map((id) => this.get(id));
      let data = await Promise.allSettled(promises);
      return data;
    } catch (error) {
      console.log("Error i getMultiple", error);
    }
  };
  getPlanet = async (homeworld) => {
    try {
      let { name } = await this.get(homeworld);
      return name;
    } catch (error) {
      console.log(error);
    }
  };
  get = async (url) => {
    try {
      //console.log(url);
      let response = await fetch(url);
      let json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      console.log("Fel i get");
    }
  };
  addPictureCard() {
    let short = this.name.toLowerCase().replace(/ .*/, "");
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
                <div>
                  <button class="planet-button ${short}">Homeplanet</button>
                  <button class="first-button ${short}">First Movie</button>
                  <button class="both-button ${short}">Both</button>
                  <button class="vehicle-button ${short}">$vehicle</button>
                </div>
            </div>
        `;
    document.querySelector(".picture-cards").append(div);
    this.addCardEventlisteners(short);
  }
  addCardEventlisteners(short) {
    document
      .querySelector(`.planet-button.${short}`)
      .addEventListener("click", (event) => {
        event.preventDefault();
        console.log("hime");
        this.compareHomePlanet(
          character2.name === this.name ? character1 : character2
        );
      });
    document
      .querySelector(`.first-button.${short}`)
      .addEventListener("click", (event) => {
        event.preventDefault();
        this.printFirstMovie();
      });
    document
      .querySelector(`.both-button.${short}`)
      .addEventListener("click", async (event) => {
        event.preventDefault();
        this.compareFilms(
          character2.name === this.name ? character1 : character2
        );
      });
    document
      .querySelector(`.vehicle-button.${short}`)
      .addEventListener("click", async (event) => {
        event.preventDefault();
        this.printMostExpensiveVehicle();
      });
  }
  compare(string, attr1, attr2) {
    let compareAttributes = document.querySelector(".compare-attributes");
    let attribute = document.createElement("div");
    let one = document.createElement("div");
    let title = document.createElement("div");
    let two = document.createElement("div");
    one.innerHTML = `<p>${attr1 === undefined ? "-" : attr1}</p>`;
    title.innerHTML = `<p>${string}</p>`;
    two.innerHTML = ` <p>${attr2 === undefined ? "-" : attr2}</p>`;

    if (attr1 === attr2) title.classList.add("equal");
    if (attr1 > attr2) one.classList.add("winner");
    if (attr1 < attr2) two.classList.add("winner");
    attribute.append(one, title, two);
    compareAttributes.append(attribute);
  }
  compareRender(char2) {
    this.compare("Height", this.height, char2.height);
    this.compare("Weight", this.mass, char2.mass);
    this.compare("No Films", this.nFilms, char2.nFilms);
    this.compare("Skin_color", this.skin_color, char2.skin_color);
    this.compare("Haircolor", this.hair_color, char2.hair_color);
    this.compare("Eye_color", this.eye_color, char2.eye_color);
    this.compare("Gender", this.gender, char2.gender);
  }
  generatePictureUrl() {
    return `/assets/${this.name.toLowerCase().replace(/ .*/, "")}.svg`;
  }
}

// ?Färdiga helpers

let createCharacter = async (string) => {
  let {
    name,
    gender,
    height,
    mass,
    hair_color,
    skin_color,
    eye_color,
    films,
    homeworld,
    starships,
    vehicles,
  } = await getData(BASE_URL + "people/?search=" + `${string}`);
  let newCharacter = new Character(
    name,
    gender,
    height,
    mass,
    hair_color,
    skin_color,
    eye_color,
    films,
    homeworld,
    starships,
    vehicles
  );
  return newCharacter;
};
let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    let results = json.results;
    // console.log(results);
    return results[0];
  } catch (error) {
    console.log(error);
    console.log("Fel i getData");
  }
};
// init
downloadStage();
