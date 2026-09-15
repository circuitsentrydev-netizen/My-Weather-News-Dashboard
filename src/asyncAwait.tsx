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

async function req(url: string): Promise<ResponseData> {
  const res = await fetch(url);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json();
}

async function findLocation(city: string): Promise<LocationInformation> {
  if (city.toLowerCase() === "pietermaritzburg") {
    return DUT_INDUMISO;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
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
  return req(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
}

async function findNews(loc: LocationInformation): Promise<ResponseData[]> {
  const data = await req("https://dummyjson.com/posts?limit=3");

  return (data.posts ?? []).slice(0, 3).map((post: ResponseData) => ({
    headline: post.title,
    source: "DummyJSON",
    date: "",
    link: `https://dummyjson.com/posts/${post.id}`,
  }));
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
function display(loc: LocationInformation, weather: ResponseData, news: ResponseData[]): void {
  const cur = weather.current;

  console.log(`\n${loc.country} | ${loc.city} | ${loc.town}`);
  console.log(`Temperature: ${cur.temperature_2m}°C | Humidity: ${cur.relative_humidity_2m}%`);
  console.log(`Wind: ${cur.wind_speed_10m} km/h\n`);

  news.forEach((art, i) => console.log(`${i + 1}. ${art.headline}\n${art.source}\n${art.link}`));
}
// Execute the application
runDashboard();