import "./style.css";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const GEOLOCATION_URL =
  "https://ip-geo-location.p.rapidapi.com/ip/check?format=json";
const GEOLOCATION_HOST = "ip-geo-location.p.rapidapi.com";
const WEATHER_URL =
  "https://community-open-weather-map.p.rapidapi.com/weather?units=imperial&q=";
const WEATHER_HOST = "community-open-weather-map.p.rapidapi.com";
const CHUCK_NORRIS_URL =
  "https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random?category=dev";
const CHUCK_NORRIS_HOST = "matchilling-chuck-norris-jokes-v1.p.rapidapi.com";
const NEWS_URL = "https://breaking-news2.p.rapidapi.com/wp-json/wp/v2/posts";
const NEWS_HOST = "breaking-news2.p.rapidapi.com";

const getData = async (url, host) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": host,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const runApiQueries = async () => {
  const app = document.getElementById("app");
  // GET CITY NAME
  const geoData = await getData(GEOLOCATION_URL, GEOLOCATION_HOST);
  console.log(geoData);

  // GET WEATHER DATA BY CITY
  const weatherData = await getData(
    WEATHER_URL + geoData.city.name,
    WEATHER_HOST
  );
  console.log(weatherData);

  // UPDATE UI WITH DATA
  app.innerHTML += /*html*/ `
  <div
    class="
      flex
      bg-blue-500
      text-white
      rounded
      py-2
      px-8
      w-full
      max-w-2xl
      items-center
      border-2 border-blue-300
      shadow-lg
    "
  >
    <div class="flex flex-col flex-grow">
      <div class="text-md">${weatherData.weather[0].main}</div>
      <div class="flex h-max items-center">
        <div class="font-medium text-6xl">${weatherData.main.temp}°</div>
        <div class="flex flex-col ml-4 pl-4 border-l-2 border-blue-400">
          <div>${weatherData.weather[0].description.toUpperCase()}</div>
          <div class="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="pl-1">${weatherData.name}</span>
          </div>
        </div>
      </div>
    </div>
    <img
      class="
        self-center
        inline-flex
        items-center
        justify-center
        rounded-lg
        h-28
        w-28
      "
      src="http://openweathermap.org/img/wn/${
        weatherData.weather[0].icon
      }@2x.png"
      alt="weather icon"
    />
  </div>
  `;

  // GET CHUCK NORRIS JOKES
  const chuckData = await getData(CHUCK_NORRIS_URL, CHUCK_NORRIS_HOST);
  console.log(chuckData);

  // UPDATE UI WITH DATA
  app.innerHTML += /*html*/ `
  <div
    class="
      max-w-2xl
      w-full
      bg-purple-400
      border-2 border-gray-300
      shadow-lg
      p-6
      rounded-md
      tracking-wide
    "
  >
    <div class="flex items-center mb-4">
      <img
        alt="avatar"
        class="w-20"
        src=${chuckData.icon_url}
      />
      <div class="leading-5 ml-6 sm">
        <h4 class="text-xl font-semibold">Chuck Norris</h4>
        <h5 class="font-semibold text-purple-800">Boss</h5>
      </div>
    </div>
    <div class="text-center">
      <q class="italic text-white text-lg"
        >${chuckData.value}</q
      >
    </div>
  </div>
  `;

  // GET NEWS DATA
  const newsData = await getData(NEWS_URL, NEWS_HOST);
  console.log(newsData);

  newsData.forEach((article) => {
    app.innerHTML += /*html*/ `
    <div class="max-w-2xl w-full flex border-2 border-gray-300 shadow-lg">
      <img
        class="h-auto w-48 flex-none rounded-l object-cover"
        src=${article.jetpack_featured_media_url}
        alt="Image Description"
      />

      <div
        class="
          bg-white
          rounded-r
          p-4
          flex flex-col
          justify-between
          leading-normal
        "
      >
        <div class="mb-0">
          <div class="text-black font-bold text-xl mb-0">
            ${article.title.rendered.replace("<p>", "").replace("</p>", "")}
          </div>
          <p class="text-grey-darker text-sm overflow-hidden overflow-ellipsis max-h-24">
            ${article.excerpt.rendered.replace("<p>", "").replace("</p>", "")}
          </p>
        </div>
      </div>
    </div>
    `;
  });
};

runApiQueries();
