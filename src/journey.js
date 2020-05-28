import fetch from "node-fetch";

export const parseLeg = (leg) => {
  const { summary } = leg.instruction;
  const { lineString } = leg.path;

  return {
    summary,
    lineString,
  };
};

export const parseResults = (results) => {
  if (results && results.journeys) {
    const { journeys } = results;

    if (!journeys.length) {
      throw new Error("No journey found");
    }

    //  interested just in the first journey
    const firstJourney = journeys[0];

    if (!firstJourney.legs || !firstJourney.legs.length) {
      throw new Error("Journey missing legs");
    }

    const { legs } = firstJourney;
    return {
      legs: legs.map(parseLeg),
    };
  }
};

export const getFetchUrl = (from, to) => {
  const { TFL_APP_ID, TFL_APP_KEY } = process.env;
  const BASE_URL = "https://api.tfl.gov.uk/journey/journeyresults/";
  return `${BASE_URL}/${from}/to/${to}?app_id=${TFL_APP_ID}&app_key=${TFL_APP_KEY}`;
  
}

export const fetchJourney = async (from, to) => {
  const url = getFetchUrl(from, to);
  try {
    const response = await fetch(url);
    return await response.json();
  } catch(err) {
    console.error(`Error fetching data: ${err}`);
  }
  
};

export const getJourney = async (from, to) => {
  const json = await fetchJourney(from, to);
  return parseResults(json);
};
