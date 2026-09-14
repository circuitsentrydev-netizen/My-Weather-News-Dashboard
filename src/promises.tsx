type ResponseData = Record<string, any>;

type LocationInformation = { city: string; town: string; country: string; latitude: number; longitude: number; };

const requestedCity = process.argv[2] ?? "Johannesburg";



const requestData = (endpoint: string, readText = false) =>

  fetch(endpoint).then(response => response.ok ? (readText ? response.text() : response.json()) : Promise.reject(new Error(`HTTP ${response.status}`)));



function findLocation(city: string): Promise<LocationInformation> {

  return requestData(`https://open-meteo.com{encodeURIComponent(city)}&count=1`)

    .then(response => {

      const result = response.results?.[0];

      if (!result) throw new Error("City not found.");

      return { city: result.name, town: result.admin3 ?? result.admin2 ?? result.name, country: result.country, latitude: result.latitude, longitude: result.longitude };

    });

}



function findNews(location: LocationInformation): Promise<ResponseData[]> {

  return requestData(`https://google.com{encodeURIComponent(location.city)}+South+Africa&hl=en-ZA&gl=ZA&ceid=ZA:en`, true)

    .then(xml => {

      const readTag = (article: string, name: string) => (article.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&");

      return [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map(match => ({

        headline: readTag(match[1], "title"), source: readTag(match[1], "source"), date: readTag(match[1], "pubDate"), link: readTag(match[1], "link")

      }));

    });

}



findLocation(requestedCity)

  .then(location => {

    const weatherRequest = requestData(`https://open-meteo.com{location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);

    const newsRequest = findNews(location);

    

    Promise.race([weatherRequest, newsRequest]).then(() => console.log("First response received."));

    return Promise.all([weatherRequest, newsRequest]).then(([weather, news]) => ({ location, weather, news }));

  })

  .then(({ location, weather, news }) => {

    const currentWeather = weather.current;

    console.log(`\n${location.country} | ${location.city} | ${location.town}`);

    console.log(`Temperature: ${currentWeather.temperature_2m}°C | Humidity: ${currentWeather.relative_humidity_2m}%`);

    console.log(`Wind: ${currentWeather.wind_speed_10m} km/h\n`);

    news.forEach((article, index) => console.log(`${index + 1}. ${article.headline}\n${article.source} | ${article.date}\n${article.link}`));

  })

  .catch(error => console.error(error instanceof Error ? error.message : error));