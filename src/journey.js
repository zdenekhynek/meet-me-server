import fetch from "node-fetch";

export const parseLeg = (leg) => {
  const { summary } = leg.instruction;
  const { lineString } = leg.path;

  return {
    summary,
    coords: lineString ? JSON.parse(lineString) : [],
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

export const findIntersectionIndices = (arr1, arr2) => {
  let index1 = -1;
  let index2 = -1;

  //  convert to strings for easier finding of index
  const primitiveArr1 = arr1.map((j) => j.join(";"));
  const primitiveArr2 = arr2.map((j) => j.join(";"));

  index1 = primitiveArr1.findIndex((j) => {
    index2 = primitiveArr2.indexOf(j);
    return index2 > -1;
  });

  return [index1, index2];
};

export const concatLegsCoords = (legs = []) => {
  return legs.reduce((acc, leg) => {
    const { coords } = leg;
    return acc.concat(coords);
  }, []);
};

export const sliceLegsAtIndex = (legs = [], index = -1) => {
  const sliceLegs = [];
  let lengthSum = 0;

  legs.find((leg) => {
    const { coords = [] } = leg;

    if (lengthSum + coords.length <= index) {
      //  we haven't reach the index yet
      sliceLegs.push(leg);

      //  continue the loop
      lengthSum += coords.length;
      return false;
    } else {
      //  we have reach the leg the index
      //  calculate the index withing the legs array
      const legIndex = lengthSum ? index - lengthSum : index;
      leg.coords = leg.coords.slice(0, legIndex + 1);

      sliceLegs.push(leg);

      //  short circuit the loop
      //  we don't care about any additional legs
      return true;
    }
  });

  return sliceLegs;
};

export const findJourneyIntersection = (journey1 = {}, journey2 = {}) => {
  //  concat all the legs
  const { legs: legs1 = [] } = journey1;
  const { legs: legs2 = [] } = journey2;
  const coordArr1 = concatLegsCoords(legs1);
  const coordArr2 = concatLegsCoords(legs2);

  //  get indices
  const [index1, index2] = findIntersectionIndices(coordArr1, coordArr2);

  //  if found common point, truncate the legs of the journey
  const truncatedFromJourney =
    index1 > -1
      ? { ...journey1, legs: sliceLegsAtIndex(legs1, index1) }
      : journey1;
  const truncatedToJourney =
    index2 > -1
      ? {
          ...journey2,
          legs: sliceLegsAtIndex(legs2, index2),
        }
      : journey2;

  //  split that leg and discard the rest
  return [truncatedFromJourney, truncatedToJourney];
};

export const getFetchUrl = (from, to) => {
  const { TFL_APP_ID, TFL_APP_KEY } = process.env;
  const BASE_URL = "https://api.tfl.gov.uk/journey/journeyresults/";
  return `${BASE_URL}/${from}/to/${to}?app_id=${TFL_APP_ID}&app_key=${TFL_APP_KEY}`;
};

export const fetchJourney = async (from, to) => {
  const url = getFetchUrl(from, to);
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching data: ${err}`);
  }
};

export const getJourney = async (from, to) => {
  const json = await fetchJourney(from, to);
  return parseResults(json);
};
