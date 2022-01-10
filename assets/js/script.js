const geoapifyKEY = "81227bc9482642b8b313e75b6f99fa21";
const inputEL = document.getElementById("input");
// Define: distance from input
const distanceEL = $("#distance")
// target: Grid for card HTML injection
const startEL = $("#start")

// # Retreive: city from user text input, linked to event listiner
const searchEl = document.getElementById("searchcity");
// # Debug: Search button
console.log(searchEl);
// const movielist = (cinema) => {};

// # Retreive: movie list from city search fucntion
const whatsrunning = (data) => {
    console.log("WHATS RUNNING", data.cinema_id)
    if (data.cinema_id) {
        movielist(data.cinema_id)
    }
}

// NAV BAR MENU
$(document).ready(function () {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu" it will set the class active and open the menu . Can modify it but dont delete this line -Bobby
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });
  });


// **
// * Function: moviesRunningAt
// * Description: Fetch movie details from cinema data collected
const moviesrunningat = async (cinema) => {
    console.log("Getting details of ", cinema);
    const url = `https://api.internationalshowtimes.com/v4/movies/?cinema_id=${cinema}&apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`;
    const response = await fetch(url);
    if (response.status === 200) {
      const movielist = await response.json();
  
      return movielist.movies;
    }
  };
//   Create: cards displaying movie and cinema
  const createcard = (cinema_name, cinema_web, cinema_addr, title, poster) => {
    let cardEL = " ";
    console.log(`MYDATA ${title},${cinema_name}`);
//   Check: If corresponding area from input has movies playing , and write cards to HTML
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
                </div>
                  
                    
                  
                 
              </div>
       
         
  `;
      startEL.append(cardEL);
      const selection = $(".mycard");
      selection.on("click", function (event) {
        console.log("clicked on ", event);
      });
    }
  
  };

  //** Function: getMovies
  // * Description: Retreives cinemas from area data
const getmovies = async(lon, lat) => {
    const cinemalist = [];

    const url = `https://api.internationalshowtimes.com/v4/cinemas/?location=${lon},${lat}&distance=5&apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`;
        //https://api.internationalshowtimes.com/v4/showtimes?movie_id=18047&location=52.331705,13.37&distance=30

    const response = await fetch(
        url
    );

    if (response.status === 200) {
        const data = await response.json();
        $(".cardclass").remove();

        console.log("CARDCLASS", $(".cardclass"));

        for (let i in data.cinemas) {
            const cinema_id = data.cinemas[i].id;
            const cinema_name = data.cinemas[i].name;
            const cinema_web = data.cinemas[i].website;
            const addr = data.cinemas[i].location.address.display_text;

            console.log(` CINEMA DETAILS [${addr}]`);

            const movielist = await moviesrunningat(cinema_id);
            for (let movie in movielist) {
                const title = movielist[movie].title;
                const poster = movielist[movie].poster_image_thumbnail;
                    //  console.log("MYMOVIEDATA=  ", movielist[movie])

                createcard(cinema_name, cinema_web, addr, title, poster);
            }
        }
    }
    // ** For additional functinality later (IMDB rating addition to movie card)
    // for (let i = 0; i <= data.cinemas.length; i++) {
    //     console.log(data.cinemas[i])
    //     whatsrunning(data.cinemas[i])

    // }
    //}

    // const id = ['tt4513678', 'tt11214590', 'tt10838180', 'tt2397461', 'tt3581652']
    // for (let i in id) {
    //     getdetails(i)
    // }
};

// **
// * Function: searchCity
// * Description: gets longitude and lattiude from the inputEL constant defined (references HTML form input text)
// **

const searchcity = async (city) => {
    console.log("searching for city ", city);
    const fetchurl = `https://api.geoapify.com/v1/geocode/search?text=${city}%20Australia&apiKey=81227bc9482642b8b313e75b6f99fa21`;
    const response = await fetch(fetchurl);
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      const [lat, lon] = await data.features[0].geometry.coordinates;
      console.log(data.features[0].geometry.coordinates);
      console.log(" long lat ", lon, lat);
      getmovies(lon, lat);
    }
  };


//   # Bind: Search button to Form input funnction
  searchEl.addEventListener("click", () => {
    searchcity(inputEL.value);

    // *for additional functionality (distance from area)
        // let myseletion = "";
  
    // const selection = $('input[type="radio"]:checked').val();
  
    // console.log("VALUE is ", selection);
  });