const BASE_URL = "https://swapi.dev/api/";
let deleteClick = false;
let downloadBtn = document.getElementById("download-button");
let character1;
let character2;
async function downloadStage() {
  try {
    let arr = [
      document.getElementById("character-1").value,
      document.getElementById("character-2").value,
    ];
    let promises = arr.map((val) => getCharacterData(val));
    let [a, b] = await Promise.allSettled(promises);
    character1 = createCharacter(a.value);
    character2 = createCharacter(b.value);

    character1.addPictureCard();
    character1.addCardEventlisteners();
    character2.addPictureCard();
    character2.addCardEventlisteners();
    character1.bothEventlistener(character2)
    character2.bothEventlistener(character1)
    character1.compareRender(character2)

    let buttonDiv = document.querySelector(".button-div");
    buttonDiv.classList.remove("rotated");
  } catch (error) {}
}
downloadBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!deleteClick) {
    deleteClick = true;
    setTimeout(() => {
      deleteClick=false
    }, 1500);
    let cardSection = document.querySelector(".card-section");
    cardSection.classList.remove("rotated")
    let pcard = document.querySelector(".picture-cards")
    pcard.innerHTML = "";
    setTimeout(() => {
      pcard.classList.remove("rotated")
      document.querySelector("header h2").classList.add("scale")
      setTimeout(() => {
      document.querySelector("header h2").classList.add("none");
        
      }, 200);
    }, 100);
    
    document.querySelector(".compare-attributes").innerHTML="";
    downloadStage();
  } else {
    console.log("Stop clicking you shall");
  }
});

let compareButton = document.getElementById("compare-button");
compareButton.addEventListener("click", (event) => {
  event.preventDefault();
  let compareSection = document.querySelector(".compare-section");
  compareSection.classList.toggle("none");
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
  //*     Methods
  bothEventlistener(character2) {
    let bothBtn = document.querySelector(`.both-button.${this.getShortName()}`);
    bothBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.compareFilms(character2);
    });
    bothBtn.classList.remove("rotated");
  }
  printMostExpensiveVehicle = async () => {
    let vehicles = await this.vehicles;
    let starships = await this.starships;
    let all = [...vehicles, ...starships];
    all.sort((a, b) => {
      const aPrice = a[2] === "unknown" ? 0 : parseInt(a[2]);
      const bPrice = b[2] === "unknown" ? 0 : parseInt(b[2]);
      return bPrice - aPrice;
    });
    if (all.length > 0) {
      this.printToCardMsg(`<h3>${this.name}'s most expensive vehicle is:</h3>
      <p>Model:${all[0][0]}</p>
      <p>Name:${all[0][1]}</p>
      <p>Price: ${all[0][2]} space dollars</p>
       `);
    } else {
      this.printToCardMsg(`<p>${this.name} doesn't have any vehicles</p>`);
    }
  };
  getVehicles = async (url) => {
    let vehicles = await this.getMultiple(url);
    //console.log(vehicles);
    let veArr = vehicles.map((vehicle) => {
      let { model, name, cost_in_credits } = vehicle.value;
      return [model, name, cost_in_credits];
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
  getShortName() {
    return this.name.toLowerCase().replace(/ .*/, "");
  }
  addPictureCard() {
    let short = this.getShortName();
    let div = document.createElement("div");
    div.classList.add("card");
    div.style.background = `url(${this.pictureURL})`;
    div.innerHTML = `
            <div class="picture">
                <div id="">
                    <h3>${this.name}</h3>
                </div>
                <div>
                  <button class="homeworld-button ${short} rotated">Homeworld</button>
                  <button class="first-button ${short} rotated">First Movie</button>
                  <button class="both-button ${short} rotated">Both</button>
                  <button class="vehicle-button ${short} rotated">$vehicle</button>
                </div>
            </div>
        `;
    document.querySelector(".picture-cards").append(div);
  }
  addCardEventlisteners() {
    this.homeworldEventistener(this.getShortName());
    this.firstEventistener(this.getShortName());
    this.vehicleEventistener(this.getShortName());
  }
  homeworldEventistener = async (short) => {
    await this.homeworld;
    let planetBtn = document.querySelector(`.homeworld-button.${short}`);
    planetBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.compareHomePlanet(
        character2.name === this.name ? character1 : character2
      );
    });
    planetBtn.classList.remove("rotated");
  };

  firstEventistener = async (short) => {
    await this.films;
    let firstBtn = document.querySelector(`.first-button.${short}`);
    firstBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.printFirstMovie();
    });
    firstBtn.classList.remove("rotated");
  };
  vehicleEventistener = async (short) => {
    await this.vehicles;
    await this.starships;
    let vehicleBtn = document.querySelector(`.vehicle-button.${short}`);
    vehicleBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.printMostExpensiveVehicle();
    });
    vehicleBtn.classList.remove("rotated");
  };
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
    return `/assets/${this.name.toLowerCase().replace(/ .*/, "")}.png`;
  }
}

// ?Färdiga helpers

function createCharacter(data) {
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
  } = data;
  return new Character(
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
}
async function getCharacterData(string) {
  return await getData(BASE_URL + "people/?search=" + `${string}`);
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
//downloadStage();
