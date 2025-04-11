//mock testing by usigng filters
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
