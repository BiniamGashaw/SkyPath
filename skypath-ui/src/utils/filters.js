// mock testing using filters
import airports from "../data/airports";
import airlines from "../data/airlines";

export const filterByCountry = (airlines, country) =>
  airlines.filter((a) => a.country.toLowerCase() === country.toLowerCase());

export const filterByStops = (airlines, stops) =>
  airlines.filter((a) => a.stops === parseInt(stops));

export const filterByCodeShare = (airlines) =>
  airlines.filter((a) => a.codeShare === true);

export const filterByActiveUS = (airlines) =>
  airlines.filter((a) => a.country === "United States" && a.active);

export const filterBetweenCities = (airlines, from, to) =>
  airlines.filter(
    (a) =>
      a.sourceCity.toLowerCase() === from.toLowerCase() &&
      a.destCity.toLowerCase() === to.toLowerCase()
  );

export const filterByTripStops = (airlines, from, to, maxStops) =>
  airlines.filter(
    (a) =>
      a.sourceCity.toLowerCase() === from.toLowerCase() &&
      a.destCity.toLowerCase() === to.toLowerCase() &&
      a.stops < parseInt(maxStops)
  );

export const filterByDistance = (airlines, fromCity) =>
  airlines.filter((a) => a.sourceCity.toLowerCase() === fromCity.toLowerCase());

// ✅ Airport Density Logic

export function getAirportDensityByCountry() {
  const densityMap = {};

  airports.forEach((airport) => {
    const country = airport.country?.trim() || "Unknown";
    if (country && country !== "\\N") {
      densityMap[country] = (densityMap[country] || 0) + 1;
    }
  });

  const sorted = Object.entries(densityMap).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;

  const [topCountry, count] = sorted[0];
  return { country: topCountry, count };
}


// ✅ Airport Traffic Logic

export const getAirportTrafficByCity = (topN = 5) => {
  const trafficMap = {};

  airlines.forEach((route) => {
    const source = route.sourceCity;
    const dest = route.destCity;

    if (source) trafficMap[source] = (trafficMap[source] || 0) + 1;
    if (dest) trafficMap[dest] = (trafficMap[dest] || 0) + 1;
  });

  const sorted = Object.entries(trafficMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sorted.map(([city, count]) => `${city}: ${count} flights`);
};
