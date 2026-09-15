type ResponseData = Record<string, any>;

type LocationInformation = { city: string; town: string; country: string; latitude: number; longitude: number; };

const requestedCity = "Pietermaritzburg";

// DUT Indumiso Campus — verified coordinates
const DUT_INDUMISO: LocationInformation = {
  city: "Pietermaritzburg",
  town: "Edendale",
  country: "South Africa",
  latitude: -29.6468624,
  longitude: 30.3494303,
};

const requestData = (endpoint: string) =>
  fetch(endpoint).then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)));

function findLocation(city: string): Promise<LocationInformation> {
  if (city.toLowerCase() === "pietermaritzburg") {
    return Promise.resolve(DUT_INDUMISO);
  }

  return requestData(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    .then(response => {
      const result = response.results?.[0];

      if (!result) throw new Error("City not found.");

      return { city: result.name, town: result.admin3 ?? result.admin2 ?? result.name, country: result.country, latitude: result.latitude, longitude: result.longitude };
    });
}

function findNews(location: LocationInformation): Promise<ResponseData[]> {
  return requestData(`https://dummyjson.com/posts?limit=3`)
    .then(response => (response.posts ?? []).slice(0, 3).map((post: ResponseData) => ({
      headline: post.title,
      source: "DummyJSON",
      date: "",
      link: `https://dummyjson.com/posts/${post.id}`,
    })));
}

findLocation(requestedCity)
  .then(location => {
    const weatherRequest = requestData(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
    const newsRequest = findNews(location);

    Promise.race([weatherRequest, newsRequest]).then((value) => console.log(`First response received: ${Array.isArray(value) ? "news" : "weather"}`));
    return Promise.all([weatherRequest, newsRequest]).then(([weather, news]) => ({ location, weather, news }));
  })
  .then(({ location, weather, news }) => {
    const currentWeather = weather.current;

    console.log(`\n${location.country} | ${location.city} | ${location.town}`);
    console.log(`Temperature: ${currentWeather.temperature_2m}°C | Humidity: ${currentWeather.relative_humidity_2m}%`);
    console.log(`Wind: ${currentWeather.wind_speed_10m} km/h\n`);

    news.forEach((article: ResponseData, index: number) => console.log(`${index + 1}. ${article.headline}\n${article.source}\n${article.link}`));
  })
  .catch(error => console.error(error instanceof Error ? error.message : error));