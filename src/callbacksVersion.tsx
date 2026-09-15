import https from "node:https";

type ResponseData = Record<string, any>;
type CallbackFunction<T> = (error: Error | null, data?: T) => void;

type LocationInformation = { 
  city: string; 
  town: string; 
  country: string; 
  latitude: number; 
  longitude: number; 
};

const requestedCity = "Pietermaritzburg";

const DUT_INDUMISO: LocationInformation = {
  city: "Pietermaritzburg",
  town: "Edendale",
  country: "South Africa",
  latitude: -29.6468624,
  longitude: 30.3494303,
};

// Low-level HTTPS request helper using callbacks
function requestData(url: string, callback: CallbackFunction<any>): void {
  https.get(url, (res) => {
    let body = "";

    if ((res.statusCode ?? 500) >= 400) {
      return callback(new Error(`HTTP ${res.statusCode}`));
    }

    res.setEncoding("utf8");
    res.on("data", (chunk) => { body += chunk; });
    res.on("end", () => {
      try {
        callback(null, JSON.parse(body));
      } catch (err) {
        callback(new Error("Failed to parse JSON response."));
      }
    });
  }).on("error", (err) => callback(err));
}

function findLocation(city: string, callback: CallbackFunction<LocationInformation>): void {
  if (city.toLowerCase() === "pietermaritzburg") {
    return callback(null, DUT_INDUMISO);
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  requestData(url, (err, response) => {
    if (err) return callback(err);

    const result = response?.results?.[0];
    if (!result) return callback(new Error("City not found."));

    callback(null, {
      city: result.name,
      town: result.admin3 ?? result.admin2 ?? result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  });
}

function findWeather(loc: LocationInformation, callback: CallbackFunction<ResponseData>): void {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
  requestData(url, callback);
}

function findNews(loc: LocationInformation, callback: CallbackFunction<ResponseData[]>): void {
  const url = `https://dummyjson.com/posts?limit=3`;
  requestData(url, (err, response) => {
    if (err) return callback(err);

    const news = (response?.posts ?? []).slice(0, 3).map((post: ResponseData) => ({
      headline: post.title,
      source: "DummyJSON",
      date: "",
      link: `https://dummyjson.com/posts/${post.id}`,
    }));

    callback(null, news);
  });
}

// ==========================================
// DEMONSTRATING "CALLBACK HELL" (Pyramid of Doom)
// ==========================================
findLocation(requestedCity, (locationErr, location) => {
  if (locationErr || !location) {
    return console.error("Location error:", locationErr?.message);
  }

  // Nested call 1: Weather
  findWeather(location, (weatherErr, weather) => {
    if (weatherErr || !weather) {
      return console.error("Weather error:", weatherErr?.message);
    }

    // Nested call 2: News
    findNews(location, (newsErr, news) => {
      if (newsErr || !news) {
        return console.error("News error:", newsErr?.message);
      }

      // Final output rendered inside deeply nested callback
      const cur = weather.current;
      console.log(`\n${location.country} | ${location.city} | ${location.town}`);
      console.log(`Temperature: ${cur.temperature_2m}°C | Humidity: ${cur.relative_humidity_2m}%`);
      console.log(`Wind: ${cur.wind_speed_10m} km/h\n`);

      news.forEach((article, index) => {
        console.log(`${index + 1}. ${article.headline}\n${article.source}\n${article.link}`);
      });
    });
  });
});