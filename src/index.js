import fetch from "node-fetch";

import { parseCoordString, getMidpointBetweenCoords } from "./utils";

import "dotenv/config";

// function parseResults(results) {
//   const journeys = results.journeys;
//   journeys.map(journey => {
//     const legs = journey.legs;
//     legs.forEach((leg) => {
//       console.log(leg.instruction.summary);
//       console.log(leg.path.lineString);
//     })
//   })
// }

export const fetchJourney = async(from , to) => {
  const { TFL_APP_ID, TFL_APP_KEY } = process.env;
  const BASE_URL = "https://api.tfl.gov.uk/journey/journeyresults/";
  const url = `${BASE_URL}/${from}/to/${to}?app_id=${TFL_APP_ID}&app_key=${TFL_APP_KEY}`;
  const json = await fetch(url).then(res => res.json());
  return json;
};

import express from "express";

// Set up the express app
const app = express();

app.get("/api/v1/directions/:coord1/:coord2", async(req, res) => {
  const { params } = req;
  const { coord1, coord2 } = params;
  
  const from = parseCoordString(coord1);
  const to = parseCoordString(coord2);
  const midpoint = getMidpointBetweenCoords(from, to);
  
  const fromJourney = await fetchJourney(from, midpoint);
  const toJourney = await fetchJourney(to, midpoint);

  res.status(200).send({
    success: "true",
    data: {
      from,
      to,
      midpoint,
      journeys: [fromJourney, toJourney]
    },
  });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
