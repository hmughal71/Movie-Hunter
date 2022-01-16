const geoapifyKEY = "81227bc9482642b8b313e75b6f99fa21";
const inputEL = document.getElementById("input");
// # target: Grid for card HTML injection
const startEL = $("#start");
// # target: ID for Modal 
const modalEL = document.getElementById("modalid");
// # target: Close button for Modal
const closemodalEL = document.getElementById("close");
// # target: h1 tag in side Modal
const ratingEL = document.getElementById("ratings");
// # target iframe with ID "video"
const videoEL = document.getElementById("video");

// # Retreive: city from user text input, linked to event listiner
const searchEl = document.getElementById("searchcity");

// # Retreive: movie list from city search fucntion
const whatsrunning = (data) => {
  if (data.cinema_id) {
    movielist(data.cinema_id);
  }
};

// NAV BAR MENU
$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu" it will set the class active and open the menu . Can modify it but dont delete this line -Bobby
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});

/**
 * Function: moviesRunningAt
 * Description: Fetch movie details from cinema data collected
 * @param {*} cinema 
 * @returns 
 */


const moviesrunningat = async (cinema) => {
  const url = `https://api.internationalshowtimes.com/v4/movies/?cinema_id=${cinema}&apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`;
  const response = await fetch(url);
  if (response.status === 200) {
    const movielist = await response.json();

    return movielist.movies;
  }
};

/**
 * Function: runtrailer
 * Description: unveils modal which displays the IMDB rating & trailer
 * @param {*} data 
 */

const runtrailer = (data) => {
  const rating = data.movie.ratings.imdb.value;
  const trailer = data.movie.trailers[0].trailer_files[0].url;

  const videoFile = trailer.split("v=")[1];
  const videolink = `https://www.youtube.com/embed/${videoFile}`;
  videoEL.setAttribute("src", videolink);
  modalEL.classList.add("is-active");

  ratingEL.textContent = `USER RATING ${rating}`;
  closemodalEL.addEventListener("click", () => {
    modalEL.classList.remove("is-active");
    videoEL.setAttribute("src", "");
  });

};

/**
 * Function: moviedetails
 * Description: takes the details of movie from API for use in running runtrailer
 * @param {*} movie 
 */

const moviedetails = async (movie) => {
  const url = `https://api.internationalshowtimes.com/v4/movies/${movie}?apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`;

  const resp = await fetch(url);
  if ((resp.status = 200)) {
    const mydata = await resp.json();
    runtrailer(mydata);
  }
};

/**
 * Function: createcard
 * Description: Identifies data from getmovies function to create cards in the html file
 * @param {*} cinema_name 
 * @param {*} cinema_addr 
 * @param {*} title 
 * @param {*} poster 
 * @param {*} id 
 */

const createcard = (
  cinema_name,
  cinema_addr,
  title,
  poster,
  id
) => {
  let cardEL = " ";
  //  # Check: If corresponding area from input has movies playing , and write cards to HTML
  if (cinema_name && title && poster) {
    cardEL += `
              <div class="card cardclass mycard">
              <p  class="title cardtext">${title}</p>
                  <div class="card-image">
                      <figure class="image is-100x100 myimage">
                          <img src="${poster}" alt="Placeholder image">
                      </figure>
                  </div>
                  <div class="media-content">
                  <p class="subtitle is-6 cardtext">${cinema_name}
                    ${cinema_addr}</p>
                    <p class="is-hidden"> ${id} </p>
                </div>
                  
                    
                  
                 
              </div>
       
         
  `;
  // # append: cards to the DOM
    startEL.append(cardEL);
    const selection = $(".mycard");
    selection.on("click", function (event) {
      event.stopImmediatePropagation();
      const movieid = this.textContent.split("\n")[10].trim();
      moviedetails(movieid);
    });
  }
};

/**
 * Function: getMovies
 * Description: Retreives cinemas from area data using international showtimes API
 * @param {*} lon 
 * @param {*} lat 
 */

const getmovies = async (lon, lat) => {

  const url = `https://api.internationalshowtimes.com/v4/cinemas/?location=${lon},${lat}&distance=5&apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`;
  //https://api.internationalshowtimes.com/v4/showtimes?movie_id=18047&location=52.331705,13.37&distance=30

  const response = await fetch(url);

  if (response.status === 200) {
    const data = await response.json();
    $(".cardclass").remove();

    for (let i in data.cinemas) {
      const cinema_id = data.cinemas[i].id;
      const cinema_name = data.cinemas[i].name;
      const cinema_web = data.cinemas[i].website;
      const addr = data.cinemas[i].location.address.display_text;


      const movielist = await moviesrunningat(cinema_id);
      for (let movie in movielist) {
        const title = movielist[movie].title;
        const poster = movielist[movie].poster_image_thumbnail;
        const movieid = movielist[movie].id;

        createcard(cinema_name, addr, title, poster, movieid);
      }
    }
  }
};

/**
 * Function: searchCity
 * Description: gets longitude and lattiude from the inputEl constant defined (references HTML form input text)
 * @param {*} city 
 */

const searchcity = async (city) => {
  const fetchurl = `https://api.geoapify.com/v1/geocode/search?text=${city}%20Australia&apiKey=81227bc9482642b8b313e75b6f99fa21`;
  const response = await fetch(fetchurl);
  if (response.status === 200) {
    const data = await response.json();
    const [lat, lon] = await data.features[0].geometry.coordinates;
    getmovies(lon, lat);
  }
};

//   # Bind: Search button to Form input funnction
searchEl.addEventListener("click", () => {
  searchcity(inputEL.value);

});
