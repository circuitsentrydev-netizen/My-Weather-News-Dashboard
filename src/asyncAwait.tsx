type ResponseData = Record<string, any>;

type LocationInformation = { city: string; town: string; country: string; latitude: number; longitude: number; };

const requestedCity = process.argv[2] ?? "Pietermaritzburg";



async function req(url: string, text = false) {

  const res = await fetch(url);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return text ? res.text() : res.json();

}



async function findLocation(city: string): Promise<LocationInformation> {

  const url = `https://open-meteo.com{encodeURIComponent(city)}&count=1`;


  const res = await req(url);

  const data = res.results?.[0];

  if (!data) throw new Error("City not found.");

  return {

    city: String(data.name),

    town: String(data.admin3 ?? data.admin2 ?? data.name),

    country: String(data.country),

    latitude: Number(data.latitude),

    longitude: Number(data.longitude),

  };

}



async function findWeather(loc: LocationInformation): Promise<ResponseData> {

  return req(`https://open-meteo.com{loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);

}



async function findNews(loc: LocationInformation): Promise<ResponseData[]> {

  const xml = await req(`https://google.com{encodeURIComponent(loc.city)}+South+Africa&hl=en-ZA&gl=ZA&ceid=ZA:en`, true);

  const tag = (art: string, name: string) => (art.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&");

  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map(m => ({

    headline: tag(m[1], "title"), source: tag(m[1], "source"), date: tag(m[1], "pubDate"), link: tag(m[1], "link")

  }));

}



function display(loc: LocationInformation, weather: ResponseData, news: ResponseData[]): void {

  const cur = weather.current;

  console.log(`\n${loc.country} | ${loc.city} | ${loc.town}`);

  console.log(`Temperature: ${cur.temperature_2m}°C | Humidity: ${cur.relative_humidity_2m}%`);

  console.log(`Wind: ${cur.wind_speed_10m} km/h\n`);

  news.forEach((art, i) => console.log(`${i + 1}. ${art.headline}\n${art.source} | ${art.date}\n${art.link}`));

}



async function runDashboard(): Promise<void> {

  try {

    const loc = await findLocation(requestedCity);

    const wReq = findWeather(loc), nReq = findNews(loc);

    const race = await Promise.race([wReq, nReq]);

    console.log(`First response: ${Array.isArray(race) ? "news" : "weather"}`);

    const [weather, news] = await Promise.all([wReq, nReq]);

    display(loc, weather, news);

  } catch (err) {

    console.error(err instanceof Error ? err.message : err);

  }

}

// Execute the application
runDashboard();
