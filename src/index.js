import { parseCoordString, getMidpointBetweenCoords } from "./utils";
import { getJourney } from "./journey";

import "dotenv/config";

import express from "express";

// Set up the express app
const app = express();

app.get("/api/v1/directions/:coord1/:coord2", async(req, res) => {
  const { params } = req;
  const { coord1, coord2 } = params;
  
  const from = parseCoordString(coord1);
  const to = parseCoordString(coord2);
  const midpoint = getMidpointBetweenCoords(from, to);
  
  const fromJourney = await getJourney(from, midpoint);
  const toJourney = await getJourney(to, midpoint);

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
