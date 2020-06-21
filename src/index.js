import "dotenv/config";

import express from "express";
import cors from "cors";

import { parseCoordString, getMidpointBetweenCoords } from "./utils";
import { getJourney, findJourneyIntersection } from "./journey";

// Set up the express app
const app = express();

app.use(cors());

app.get("/api/v1/directions/:coord1/:coord2", async (req, res) => {
  const { params } = req;
  const { coord1, coord2 } = params;

  const from = parseCoordString(coord1);
  const to = parseCoordString(coord2);

  //  calculate theoretical midpoint both journeys
  //  should aim for
  const midpoint = getMidpointBetweenCoords(from, to);

  try {
    console.log("Fetching first journey!");
    let fromJourney = await getJourney(from, midpoint);

    console.log("Fetching second journey!");
    let toJourney = await getJourney(to, midpoint);

    //  remove the shared part of the journey
    const [truncatedFromJourney, truncatedToJourney] = findJourneyIntersection(
      fromJourney,
      toJourney
    );

    res.status(200).send({
      success: "true",
      data: {
        from,
        to,
        midpoint,
        journeys: [truncatedFromJourney, truncatedToJourney],
        fullJourneys: [fromJourney, toJourney],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
