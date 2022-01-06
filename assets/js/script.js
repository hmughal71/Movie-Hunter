const geoapifyKEY = "81227bc9482642b8b313e75b6f99fa21";
const inputEL = document.getElementById("input");
const distanceEL = $("#distance")
const startEL = $("#start")

const searchEl = document.getElementById("searchcity");
console.log(searchEl);
const movielist = (cinema) => {


}

const whatsrunning = (data) => {
    console.log("WHATS RUNNING", data.cinema_id)
    if (data.cinema_id) {
        movielist(data.cinema_id)
    }


}





const moviesrunningat = async(cinema) => {

    console.log("Getting details of ", cinema)
    const url = `https://api.internationalshowtimes.com/v4/movies/?cinema_id=${cinema}&apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`
    const response = await fetch(url)
    if (response.status === 200) {
        const movielist = await response.json()

        return movielist.movies
    }

}

const createcard = (cinema_name, cinema_web, cinema_addr, title, poster) => {
    let cardEL = " ";
    console.log(`MYDATA ${title},${cinema_name}`)

    if (cinema_name && title && poster) {
        cardEL += `
            <div class="card cardclass mycard">
            <p  class="title cardtext">${title}</p>
                <div class="card-image">
                    <figure class="image is-100x100">
                        <img src="${poster}" alt="Placeholder image">
                    </figure>
                </div>
                <div class="media-content">
                <p class="subtitle is-6 cardtext">${cinema_name}
                  ${cinema_addr}</p>
              </div>
                
                  
                
               

            </div>
     



       
`
        startEL.append(cardEL)
        const selection = $(".mycard")
        selection.on("click", function(event) {
            console.log('clicked on ', event)
        })
    }




    //console.log("CARDDDDD ", cinema, movie)

}

const getmovies = async(lon, lat) => {

    const cinemalist = []

    const url = `https://api.internationalshowtimes.com/v4/cinemas/?location=${lon},${lat}&distance=5&apikey=u9OBRvOWsebgUcJeS0x3AMf1NK1wFI9I`
        //https://api.internationalshowtimes.com/v4/showtimes?movie_id=18047&location=52.331705,13.37&distance=30


    //url = "https://api-gate2.movieglu.com/filmsNowShowing/?n=1";
    //url = "https://api-gate2.movieglu.com/cinemasNearby/?n=5";
    // const url = "https://api-gate2.movieglu.com/filmsNowShowing/?n=10";
    const response = await fetch(
        url

        //     {
        //         method: "GET", // *GET, POST, PUT, DELETE, etc.
        //         //mode: 'no-cors', // no-cors, *cors, same-origin
        //         // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //         //credentials: 'same-origin', // include, *same-origin, omit
        //         headers: {
        //             "api-version": "v200",
        //             "Authorization": "Basic TkVFVDpqYnVldG5rUWM4eGk=",
        //             "x-api-key": "vi84gEiA6HaIcCuzRBrtbxFJ6UFM8h6al8ygnb27",
        //             "device-datetime": `${mydate}`,
        //             "territory": "AU",
        //             "client": "NEET",
        //             // "geolocation": `${lon};${lat}`
        //         },
        //         //redirect: "follow", // manual, *follow, error
        //         //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //         // body: JSON.stringify(data), // body data type must match "Content-Type" header
        //     }
    );

    if (response.status === 200) {
        const data = await response.json();
        $(".cardclass").remove();

        console.log("CARDCLASS", $(".cardclass"))

        for (let i in data.cinemas) {
            const cinema_id = data.cinemas[i].id
            const cinema_name = data.cinemas[i].name
            const cinema_web = data.cinemas[i].website
            const addr = data.cinemas[i].location.address.display_text

            console.log(` CINEMA DETAILS [${addr}]`)

            const movielist = await moviesrunningat(cinema_id)
            for (let movie in movielist) {


                const title = movielist[movie].title
                const poster = movielist[movie].poster_image_thumbnail
                    //  console.log("MYMOVIEDATA=  ", movielist[movie])


                createcard(cinema_name, cinema_web, addr, title, poster)

            }

        }

    }
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



const searchcity = async(city) => {
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

searchEl.addEventListener("click", () => {
    let myseletion = ""

    const selection = $('input[type="radio"]:checked').val()



    console.log("VALUE is ", selection)
    searchcity(inputEL.value);

});