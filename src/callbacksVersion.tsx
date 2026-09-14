  import https from "node:https";



type ResponseData = Record<string, any>;

type CallbackFunction<Value> = (error: Error | null, value?: Value) => void;

type LocationInformation = { city: string; town: string; country: string; latitude: number; longitude: number; };

const requestedCity = process.argv[2] ?? "Johannesburg";



function requestData(endpoint: string, callback: CallbackFunction<any>, readJson = true): void {

  https.get(endpoint, response => {

    let body = "";

    response.setEncoding("utf8").on("data", chunk => body += chunk).on("end", () => {

      if ((response.statusCode ?? 500) >= 400) return callback(new Error(`HTTP ${response.statusCode}`));

      try { callback(null, readJson ? JSON.parse(body) : body); } catch { callback(new Error("Could not read the response.")); }

    });

  }).on("error", callback);

}



function findLocation(city: string, callback: CallbackFunction<LocationInformation>): void {

  requestData(`https://open-meteo.com{encodeURIComponent(city)}&count=1`, (error, response) => {

    const result = response?.results?.[0];

    if (error || !result) return callback(error ?? new Error("City not found."));

    callback(null, { city: result.name, town: result.admin3 ?? result.admin2 ?? result.name, country: result.country, latitude: result.latitude, longitude: result.longitude });

  });

}



function findNews(location: LocationInformation, callback: CallbackFunction<ResponseData[]>): void {

  requestData(`https://google.com{encodeURIComponent(location.city)}+South+Africa&hl=en-ZA&gl=ZA&ceid=ZA:en`, (error, response) => {

    if (error) return callback(error);

    const readTag = (article: string, name: string) => (article.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?. [1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&");

    callback(null, [...String(response).matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map(match => ({

      headline: readTag(match[0], "title"), source: readTag(match[0], "source"), date: readTag(match[0], "pubDate"), link: readTag(match[0], "link")

    })));

  }, false);

}



findLocation(requestedCity, (locationError, location) => {

  if (locationError || !location) return console.error(locationError?.message);



  requestData(`https://open-meteo.com{location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`, (weatherError, weather) => {

    if (weatherError || !weather) return console.error(weatherError?.message);



    findNews(location, (newsError, news) => {

      if (newsError || !news) return console.error(newsError?.message);

      

      const currentWeather = weather.current;

      console.log(`\n${location.country} | ${location.city} | ${location.town}`);

      console.log(`Temperature: ${currentWeather.temperature_2m}°C | Humidity: ${currentWeather.relative_humidity_2m}%`);

      console.log(`Wind: ${currentWeather.wind_speed_10m} km/h\n`);

      news.forEach((article, index) => console.log(`${index + 1}. ${article.headline}\n${article.source} | ${article.date}\n${article.link}`));

    });

  });
})