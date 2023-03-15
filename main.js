let character1;
let character2;

let deleteClick = false;
let downloadBtn = document.getElementById("download-button");
downloadBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!deleteClick) {
    deleteClick = true;
    setTimeout(() => {
      deleteClick = false;
    }, 1500);
    let cardSection = document.querySelector(".card-section");
    cardSection.classList.remove("rotated");
    let pcard = document.querySelector(".picture-cards");
    pcard.innerHTML = "";
    setTimeout(() => {
      pcard.classList.remove("rotated");
      document.querySelector("header h2").classList.add("scale");
      setTimeout(() => {
        document.querySelector("header h2").classList.add("none");
      }, 200);
    }, 100);
    let messageAttribute = document.querySelector(".message-attribute");
    messageAttribute.innerHTML = `  <div class="message-container card"></div>
                    <div class="compare-card">
                        <div class="show-comparison">
                            <h2>Show comparison</h2>
                        </div>
                        <div class="compare-attributes card blur"></div>
                    </div>`;
    messageAttribute.addEventListener;
    let showComparison = document.querySelector(".show-comparison");
    showComparison.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("click");
      document.querySelector(".compare-attributes").classList.remove("blur");
      showComparison.classList.add("none");
    });
    downloadStage();
    messageAttribute.classList.remove("rotated");
  } else {
    console.log("Stop clicking you shall");
  }
});
async function downloadStage() {
  try {
    let charcterNames = [
      document.getElementById("character-1").value,
      document.getElementById("character-2").value,
    ];
    let promises = charcterNames.map((val) => getCharacterData(val));
    let [c1, c2] = await Promise.allSettled(promises);
    character1 = createCharacter(c1.value);
    character2 = createCharacter(c2.value);

    character1.addPictureCard();
    character2.addPictureCard();
    character1.addCardEventlisteners();
    character2.addCardEventlisteners();
    character1.compareRender(character2);
    await character1.films;
    await character2.films;
    character1.bothEventlistener(character2);
    character2.bothEventlistener(character1);
  } catch (error) {
    console.log(error);
    console.log("fet error");
  }
}

// *  Class

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
      this.printToCardMsg(`<h4>${this.name}'s most expensive vehicle is:</h4>
      <p>Model: ${all[0][0]} called <b>${all[0][1]}</b></p>
      <p>Price: ${all[0][2]} space dollar$</p>
       `);
    } else {
      this.printToCardMsg(`<p>${this.name} doesn't have any vehicles</p>`);
    }
  };
  getVehicles = async (url) => {
    let vehicles = await this.getMultiple(url);
    let veArr = vehicles.map((vehicle) => {
      let { model, name, cost_in_credits } = vehicle.value;
      return [model, name, cost_in_credits];
    });
    return veArr;
  };
  compareFilms = async (char2) => {
    let f1 = await this.films;
    let f2 = await char2.films;
    let sameMovies = f1
      .map((value) => {
        let [movie, date] = value;
        let match = f2.find(
          ([f2Movie, f2Date]) => f2Movie === movie && f2Date === date
        );
        if (match) return value;
      })
      .filter((value) => value !== undefined);
    if (sameMovies) {
      let text = [];
      sameMovies.forEach((val) => {
        let movie = `${val[0]} (${val[1].match(/^.{4}/)})<br>`;
        text.push(movie);
      });
      this.printToCardMsg(
        `<h4>Both characters appear in:</h4><p>${text.join("")}</p>`
      );
    } else {
      this.printToCardMsg(
        "<h4>The characters never appear in the same movie</h4>"
      );
    }
  };
  compareHomePlanet = async (char2) => {
    if ((await this.homeworld) === (await char2.homeworld)) {
      this.printToCardMsg(`Both characters are from ${await char2.homeworld}`);
    } else {
      this.printToCardMsg(
        `<h4>${this.name} is from ${await this.homeworld}</h4>`
      );
    }
  };
  printToCardMsg(string) {
    let msgContainer = document.querySelector(".message-container");
    msgContainer.innerHTML = `${string}`;
  }
  printFirstMovie = async () => {
    let movieArray = await this.films;
    console.log(movieArray);
    this.printToCardMsg(
      `<h4>${this.name} first appeared in ${
        movieArray[0][0]
      } in ${movieArray[0][1].match(/^.{4}/)}</h4>`
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
    let div = document.createElement("div");
    let divChild1 = document.createElement("div");
    let divChild2 = document.createElement("div");
    div.classList.add("card");
    divChild1.classList.add("picture");
    divChild1.style.backgroundImage = `url(${this.pictureURL})`;

    divChild1.innerHTML = ` 
      
        <h3>${this.name}</h3>
        <div class="svg-buttons">
              <div class="homeworld-button
              ${this.getShortName()} button">  
              ${this.generateSVG("homeworld")}
              </div>
          
              <div class="vehicle-button
              ${this.getShortName()}">
              ${this.generateSVG("vehicle")}
              </div>
             
      </div>
      `;
    divChild2.innerHTML = `
       <div class="first-button
              ${this.getShortName()}">
              ${this.generateSVG("movie")}
              </div>
      
      <button class="both-button ${this.getShortName()} rotated">Both</button>
      `;
    div.append(divChild1, divChild2);
    document.querySelector(".picture-cards").append(div);
  }
  addCardEventlisteners() {
    this.homeworldEventistener(this.getShortName());
    this.firstEventistener(this.getShortName());
    this.vehicleEventistener(this.getShortName());
  }
  homeworldEventistener = async (short) => {
    await this.homeworld;
    let homeworldBtn = document.querySelector(`.homeworld-button.${short}`);
    homeworldBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.compareHomePlanet(
        character2.name === this.name ? character1 : character2
      );
    });
    homeworldBtn.classList.add("loaded");
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
    vehicleBtn.classList.add("loaded");
  };
  compare(string, attr1, attr2) {
    let one = document.createElement("div");
    let title = document.createElement("div");
    let two = document.createElement("div");
    one.innerHTML = `<p>${attr1 === undefined ? "-" : attr1}</p>`;
    title.innerHTML = `<p>${string}</p>`;
    two.innerHTML = ` <p>${attr2 === undefined ? "-" : attr2}</p>`;

    if (attr1 === attr2) title.classList.add("equal");
    if (attr1 > attr2 && typeof attr1 === "number") one.classList.add("winner");
    if (attr1 < attr2 && typeof attr1 === "number") two.classList.add("winner");

    let attribute = document.createElement("div");
    attribute.append(one, title, two);
    document.querySelector(".compare-attributes").append(attribute);
  }
  compareRender(char2) {
    this.compare("Height", this.height, char2.height);
    this.compare("Weight", this.mass, char2.mass);
    this.compare("No Films", this.nFilms, char2.nFilms);
    this.compare("Skincolor", this.skin_color, char2.skin_color);
    this.compare("Haircolor", this.hair_color, char2.hair_color);
    this.compare("Eyecolor", this.eye_color, char2.eye_color);
    this.compare("Gender", this.gender, char2.gender);
  }
  generatePictureUrl() {
    return `/assets/${this.name.toLowerCase().replace(/ .*/, "")}.png`;
  }
  generateSVG(string) {
    if (string === "homeworld") {
      return `<svg class="globe" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 458.758 458.758" xml:space="preserve">
        <g>
            <g class="group">
                <path class="path1" d="M448.189,10.579c-11.9-11.9-30.2-13.8-54.3-5.5c-10.6,3.6-22.6,9.2-36.1,16.8c-8.1,4.6-16.8,9.8-25.8,15.8
    			c-2.4,1.6-4.8,3.2-7.3,4.9c13.8,7,26.7,15.5,38.6,25.5c2.8-1.7,5.4-3.4,8-4.9c22.8-13.6,37.1-18.8,44.6-20.3
    			c-2,10.1-10.7,32.8-37.9,72c-2.2,3.1-4.4,6.3-6.7,9.5c-5.1-6.9-10.8-13.6-17.1-19.8c-68.9-68.9-180.7-68.9-249.6,0
    			s-68.9,180.7,0,249.6c6.3,6.3,12.9,12,19.8,17.1c-3.2,2.3-6.4,4.5-9.5,6.7c-39.2,27.1-61.9,35.9-72,37.9c1.2-6.1,4.9-17,13.8-33.4
    			c3.1-5.7,6.8-12.1,11.3-19.2c-9.9-11.9-18.4-24.8-25.5-38.6c-1.7,2.4-3.3,4.9-4.9,7.3c-8.3,12.6-15.2,24.3-20.7,35
    			c-5.1,9.8-9,18.8-11.8,26.9c-8.2,24.1-6.4,42.4,5.5,54.3s30.2,13.8,54.3,5.5c17-5.8,37.8-16.8,61.9-32.6
    			c47.6-31.3,104.4-79,159.8-134.4s103.2-112.2,134.4-159.8c15.8-24.1,26.8-44.9,32.6-61.9
    			C461.889,40.779,460.089,22.579,448.189,10.579z M103.889,246.179c-9.3,0-16.8-7.5-16.8-16.8c0-38.2,14.9-74.2,41.9-101.2
    			c6.6-6.6,17.2-6.6,23.8,0c6.6,6.6,6.6,17.2,0,23.8c-20.7,20.7-32.1,48.2-32.1,77.4
    			C120.789,238.679,113.189,246.179,103.889,246.179z" />
                <path class="path2" d="M310.189,310.179c-35,35-70.6,67-104.3,94.1c52.6,7,107.9-9.7,148.3-50.1c40.5-40.5,57.2-95.7,50.1-148.3
    			C377.189,239.579,345.189,275.179,310.189,310.179z" />
            </g>
        </g>
    </svg>`;
    }
    if (string === "vehicle") {
      return `
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 460.384 460.384"
        xml:space="preserve"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g>
            {" "}
            <path d="M95.252,283.11c-13.807,0-25.039,11.232-25.039,25.039s11.232,25.039,25.039,25.039s25.039-11.233,25.039-25.039 S109.059,283.11,95.252,283.11z M95.252,318.188c-5.536,0-10.039-4.504-10.039-10.039s4.503-10.039,10.039-10.039 s10.039,4.503,10.039,10.039S100.788,318.188,95.252,318.188z"></path>{" "}
            <path d="M357.012,283.11c-13.807,0-25.04,11.232-25.04,25.039s11.233,25.039,25.04,25.039c13.806,0,25.038-11.233,25.038-25.039 S370.818,283.11,357.012,283.11z M357.012,318.188c-5.536,0-10.04-4.504-10.04-10.039s4.504-10.039,10.04-10.039 c5.535,0,10.038,4.503,10.038,10.039S362.547,318.188,357.012,318.188z"></path>{" "}
            <path d="M409.227,196.421l-66.917-7.645l-35.714-58.056c-10.905-17.728-30.61-28.741-51.424-28.741H133.676 c-34.925,0-65.792,23.518-75.063,57.193l-0.948,3.445c-4.607,16.733-17.845,30.052-34.549,34.762 C9.506,201.217,0,213.773,0,227.914v83.012c0,4.142,3.358,7.5,7.5,7.5h38.557c4.757,22.798,25.006,39.978,49.195,39.978 s44.438-17.18,49.195-39.978h163.37c4.757,22.798,25.006,39.978,49.195,39.978s44.438-17.18,49.195-39.978h40.477 c3.813,0,7.02-2.861,7.452-6.65l5.874-51.483C463.614,228.69,440.834,200.037,409.227,196.421z M15,294.313h31.949 c-0.843,2.938-1.43,5.983-1.724,9.113H15V294.313z M95.252,343.404c-19.44,0-35.255-15.815-35.255-35.255 s15.815-35.256,35.255-35.256s35.255,15.816,35.255,35.256S114.692,343.404,95.252,343.404z M357.012,343.404 c-19.44,0-35.255-15.815-35.255-35.255s15.815-35.256,35.255-35.256s35.255,15.816,35.255,35.256S376.452,343.404,357.012,343.404z M357.012,257.893c-16.987,0-32.021,8.48-41.122,21.42H182.425c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h126.284 c-0.843,2.938-1.43,5.983-1.724,9.113H145.279c-2.389-25.504-23.909-45.533-50.027-45.533c-16.987,0-32.021,8.48-41.122,21.42H15 v-51.399c0-7.455,5.012-14.075,12.187-16.098c21.728-6.126,38.947-23.452,44.94-45.218l0.948-3.445 c7.484-27.186,32.405-46.174,60.601-46.174h121.496c15.643,0,30.452,8.277,38.647,21.6l37.626,61.164 c1.207,1.962,3.249,3.26,5.537,3.522l70.541,8.059c16.002,1.831,28.943,12.335,34.67,26.276h-23.413c-4.142,0-7.5,3.358-7.5,7.5 s3.358,7.5,7.5,7.5h26.578c0.052,1.975-0.023,3.975-0.253,5.993l-2.364,20.72h-44.608 C389.033,266.373,373.998,257.893,357.012,257.893z M407.038,303.426c-0.293-3.13-0.881-6.175-1.724-9.113h35.716l-1.04,9.113 H407.038z"></path>{" "}
            <path d="M255.565,215.222h-15.76c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h15.76c4.142,0,7.5-3.358,7.5-7.5 S259.708,215.222,255.565,215.222z"></path>{" "}
            <path d="M154.846,222.722c0-4.142-3.358-7.5-7.5-7.5h-15.76c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h15.76 C151.488,230.222,154.846,226.864,154.846,222.722z"></path>{" "}
            <path d="M164.136,283.941c-1.314-3.113-4.658-5.069-8.025-4.546c-3.049,0.474-5.522,2.768-6.213,5.776 c-1.496,6.51,6.051,11.564,11.54,7.829C164.343,291.024,165.476,287.186,164.136,283.941 C163.946,283.491,164.326,284.401,164.136,283.941z"></path>{" "}
            <path d="M286.014,143.391c-6.531-10.637-18.348-17.245-30.841-17.245h-121.5c-24.087,0-45.371,16.217-51.761,39.443l-0.943,3.438 c-2.468,8.956-6.268,24.34-6.429,24.991c-0.553,2.238-0.045,4.606,1.376,6.422c1.422,1.815,3.599,2.876,5.905,2.876h227.64 c2.717,0,5.222-1.469,6.547-3.841c1.326-2.372,1.265-5.275-0.159-7.589L286.014,143.391z M199.352,141.145v47.169h-69.054v-47.018 c1.115-0.098,2.24-0.151,3.375-0.151H199.352z M95.432,173.002l0.944-3.441c2.86-10.395,9.865-18.839,18.922-23.747v42.499H91.432 C92.697,183.321,94.242,177.323,95.432,173.002z M214.352,188.314v-47.169h40.821c7.316,0,14.235,3.868,18.062,10.1l22.807,37.069 H214.352z"></path>{" "}
          </g>{" "}
        </g>
      </svg>
      `;
    }
    if (string === "movie") {
      return `<svg  viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">

<path class="camera" fill="white" d="M18.2453 43.4857H72.7119C77.768 43.4857 81.8916 47.1224 81.8916 51.5612V86.6706C81.8916 91.1094 77.7576 94.7461 72.7119 94.7461H55.886L68.1014 111.991H56.7253L43.4013 96.2318L29.9426 111.991H18.4007L30.5436 94.7461H18.2453C13.1996 94.7461 9.06568 91.1094 9.06568 86.6706V51.5612C9.06568 47.1224 13.1893 43.4857 18.2453 43.4857ZM18.4733 8.40365C23.5708 8.40365 28.1917 10.2266 31.5382 13.1615C34.8847 16.1055 36.9465 20.1706 36.9465 24.6549C36.9465 29.1393 34.8744 33.2044 31.5382 36.1484C28.1917 39.0924 23.5708 40.9063 18.4733 40.9063C13.3758 40.9063 8.75486 39.0833 5.40833 36.1484C2.07216 33.2135 0 29.1484 0 24.6641C0 20.1797 2.07216 16.1146 5.40833 13.1706C8.7445 10.2266 13.3758 8.40365 18.4733 8.40365ZM25.8294 18.1927C23.9438 16.5339 21.3432 15.513 18.4733 15.513C15.6033 15.513 13.0028 16.5339 11.1171 18.1927C9.23145 19.8516 8.07105 22.1393 8.07105 24.6641C8.07105 27.1888 9.23145 29.4766 11.1171 31.1354C13.0028 32.7943 15.6033 33.8151 18.4733 33.8151C21.3432 33.8151 23.9438 32.7943 25.8294 31.1354C27.7151 29.4766 28.8755 27.1888 28.8755 24.6641C28.8858 22.1393 27.7151 19.8424 25.8294 18.1927ZM62.807 0C69.2307 0 75.0431 2.28776 79.2496 5.98828C83.4561 9.6888 86.0566 14.8021 86.0566 20.4531C86.0566 26.1042 83.4561 31.2175 79.2496 34.918C75.0431 38.6185 69.2307 40.9063 62.807 40.9063C56.3833 40.9063 50.571 38.6185 46.3645 34.918C42.158 31.2175 39.5574 26.1042 39.5574 20.4531C39.5574 14.8021 42.158 9.6888 46.3645 5.98828C50.571 2.28776 56.3833 0 62.807 0ZM73.4372 11.1107C70.7227 8.72266 66.9617 7.23698 62.807 7.23698C58.6524 7.23698 54.9018 8.71354 52.1769 11.1107C49.4624 13.4987 47.7735 16.8073 47.7735 20.4622C47.7735 24.1172 49.452 27.4167 52.1769 29.8138C54.8914 32.2018 58.6524 33.6875 62.807 33.6875C66.9617 33.6875 70.7123 32.2109 73.4372 29.8138C76.1621 27.4167 77.8405 24.1172 77.8405 20.4622C77.8405 16.8073 76.1517 13.4987 73.4372 11.1107ZM87.1031 82.0039V56.0729L111.99 43.1667V95.2565L87.1031 82.0039Z" fill="black"/>
<path d="M33.5909 55.7273V79H30.7727V58.6818H30.6364L24.9545 62.4545V59.5909L30.7727 55.7273H33.5909ZM47.1364 70.5341L45.6307 70.9602C45.536 70.7093 45.3963 70.4654 45.2116 70.2287C45.0317 69.9872 44.7855 69.7884 44.473 69.6321C44.1605 69.4759 43.7604 69.3977 43.2727 69.3977C42.6051 69.3977 42.0488 69.5516 41.6037 69.8594C41.1634 70.1624 40.9432 70.5483 40.9432 71.017C40.9432 71.4337 41.0947 71.7628 41.3977 72.0043C41.7008 72.2457 42.1742 72.447 42.8182 72.608L44.4375 73.0057C45.4129 73.2424 46.1397 73.6046 46.6179 74.0923C47.0961 74.5753 47.3352 75.1979 47.3352 75.9602C47.3352 76.5852 47.1553 77.1439 46.7955 77.6364C46.4403 78.1288 45.9432 78.517 45.304 78.8011C44.6648 79.0852 43.9214 79.2273 43.0739 79.2273C41.9612 79.2273 41.0402 78.9858 40.3111 78.5028C39.5819 78.0199 39.1203 77.3144 38.9261 76.3864L40.517 75.9886C40.6686 76.5758 40.955 77.0161 41.3764 77.3097C41.8026 77.6032 42.3589 77.75 43.0455 77.75C43.8267 77.75 44.447 77.5843 44.9062 77.2528C45.3703 76.9167 45.6023 76.5142 45.6023 76.0455C45.6023 75.6667 45.4697 75.3494 45.2045 75.0938C44.9394 74.8333 44.5322 74.6392 43.983 74.5114L42.1648 74.0852C41.1657 73.8485 40.4318 73.4815 39.9631 72.9844C39.4991 72.4825 39.267 71.8551 39.267 71.1023C39.267 70.4867 39.4399 69.9422 39.7855 69.4688C40.1359 68.9953 40.6117 68.6236 41.2131 68.3537C41.8191 68.0838 42.5057 67.9489 43.2727 67.9489C44.3523 67.9489 45.1998 68.1856 45.8153 68.6591C46.4356 69.1326 46.8759 69.7576 47.1364 70.5341ZM54.6026 68.0909V69.5114H48.9492V68.0909H54.6026ZM50.5969 65.4773H52.2731V75.875C52.2731 76.3485 52.3417 76.7036 52.479 76.9403C52.6211 77.1723 52.801 77.3286 53.0188 77.4091C53.2414 77.4848 53.4757 77.5227 53.7219 77.5227C53.9066 77.5227 54.0581 77.5133 54.1765 77.4943C54.2949 77.4706 54.3896 77.4517 54.4606 77.4375L54.8015 78.9432C54.6879 78.9858 54.5292 79.0284 54.3256 79.071C54.122 79.1184 53.864 79.142 53.5515 79.142C53.078 79.142 52.614 79.0402 52.1594 78.8366C51.7096 78.633 51.3356 78.3229 51.0373 77.9062C50.7437 77.4896 50.5969 76.964 50.5969 76.3295V65.4773Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_12_3">
<rect fill="black"/>
</clipPath>
</defs>
</svg>
`;
    }
  }
}
// ?  -- Färdiga helpers

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
  return await getData(
    "https://swapi.dev/api/" + "people/?search=" + `${string}`
  );
}
let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    //console.log(json);
    return json.results[0];
  } catch (error) {
    console.log(error);
    console.log("Fel i getData");
  }
};
