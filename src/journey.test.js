import { expect } from "chai";

import {
  parseResults,
  findIntersectionIndices,
  concatLegsCoords,
  sliceLegsAtIndex,
  findJourneyIntersection,
  getDestination,
} from "./journey";
import * as fixture from "./fixtures/sample-journey.json";

describe("Journey", () => {
  describe("parseResults", () => {
    it("should return correct result", () => {
      const result = parseResults(fixture);
      expect(result.legs.length).to.deep.equal(3);
      expect(result.legs[0].summary.length).to.be.above(0);
      expect(result.legs[0].coords.length).to.be.above(0);
    });
  });

  describe("findIntersectionIndices", () => {
    it("should find intersection in a coords array", () => {
      let arr1 = [
        [0, 1],
        [0, 2],
      ];
      let arr2 = [
        [1, 1],
        [0, 2],
      ];
      expect(findIntersectionIndices(arr1, arr2)).to.deep.equal([1, 1]);

      arr1 = [[1, 1]];
      expect(findIntersectionIndices(arr1, arr2)).to.deep.equal([0, 0]);
      expect(findIntersectionIndices(arr2, arr1)).to.deep.equal([0, 0]);

      arr1 = [
        [3, 1],
        [0, 3],
      ];
      arr2 = [
        [0, 1],
        [0, 4],
        [0, 3],
      ];
      expect(findIntersectionIndices(arr1, arr2)).to.deep.equal([1, 2]);
      expect(findIntersectionIndices(arr2, arr1)).to.deep.equal([2, 1]);
    });
  });

  describe("concatLegsCoords", () => {
    it("should put coords arrays together", () => {
      const legs = [
        {
          coords: [
            [0, 1],
            [0, 2],
          ],
        },
        {
          coords: [
            [0, 2],
            [0, 3],
          ],
        },
      ];

      expect(concatLegsCoords(legs)).to.have.length(4);
    });
  });

  describe("sliceLegsAtIndex", () => {
    it("should get legs until coord index and truncate the last one", () => {
      let legs = [
        {
          coords: [
            [0, 1],
            [0, 2],
          ],
        },
      ];
      let result = sliceLegsAtIndex(legs, 0);
      expect(result[0].coords.length).to.equal(1);
      expect(result[0].coords[0]).to.deep.equal([0, 1]);

      legs = [
        {
          coords: [
            [0, 1],
            [0, 2],
          ],
        },
      ];
      result = sliceLegsAtIndex(legs, 1);
      expect(result[0].coords.length).to.equal(2);
      expect(result[0].coords[1]).to.deep.equal([0, 2]);

      legs = [
        {
          coords: [
            [0, 1],
            [0, 2],
            [0, 3],
          ],
        },
        {
          coords: [
            [0, 4],
            [0, 5],
            [0, 6],
          ],
        },
      ];
      result = sliceLegsAtIndex(legs, 4);
      expect(result[0].coords.length).to.equal(3);
      expect(result[1].coords.length).to.equal(2);
      expect(result[1].coords[1]).to.deep.equal([0, 5]);

      legs = [
        {
          coords: [
            [0, 1],
            [0, 2],
            [0, 3],
          ],
        },
        {
          coords: [
            [0, 4],
            [0, 5],
            [0, 6],
          ],
        },
        {
          coords: [
            [0, 7],
            [0, 8],
            [0, 9],
          ],
        },
        {
          coords: [
            [0, 10],
            [0, 11],
            [0, 12],
          ],
        },
      ];
      result = sliceLegsAtIndex(legs, 7);
      expect(result.length).to.equal(3);
      expect(result[0].coords.length).to.equal(3);
      expect(result[1].coords.length).to.equal(3);
      expect(result[2].coords.length).to.equal(2);
      expect(result[2].coords[1]).to.deep.equal([0, 8]);
    });
  });

  describe("findJourneyIntersection", () => {
    it("should find intersection in two journeys", () => {
      let journey1 = {
        legs: [
          {
            coords: [
              [0, 1],
              [0, 2],
            ],
          },
        ],
      };

      let journey2 = {
        legs: [
          {
            coords: [
              [1, 1],
              [0, 2],
              [0, 3],
            ],
          },
        ],
      };
      const result = findJourneyIntersection(journey1, journey2);
      expect(result[0].legs[0].coords[0]).to.deep.equal([0, 1]);
    });

    it("should work for empty or not intersecting journeys", () => {
      let journey1 = { legs: [{ coords: [] }] };

      let journey2 = {
        legs: [
          {
            coords: [
              [1, 1],
              [0, 2],
              [0, 3],
            ],
          },
        ],
      };
      let result = findJourneyIntersection(journey1, journey2);
      expect(result[1].legs[0].coords.length).equal(3);

      journey1 = {
        legs: [
          {
            coords: [
              [1, 4],
              [0, 4],
              [0, 5],
            ],
          },
        ],
      };
      journey2 = {
        legs: [
          {
            coords: [
              [1, 1],
              [0, 2],
              [0, 3],
            ],
          },
        ],
      };
      result = findJourneyIntersection(journey1, journey2);
      expect(result[0].legs[0].coords.length).equal(3);
      expect(result[1].legs[0].coords.length).equal(3);
    });
  });

  describe("getDestination", () => {
    it("should find destination from leg summary", () => {
      let journey1 = { legs: [{ summary: "141 bus to Eagle Wharf Road" }] };
      let journey2 = {
        legs: [
          {
            summary: "141 bus to Eagle Wharf Road",
          },
        ],
      };

      let result = getDestination(journey1, journey2);
      expect(result).to.deep.equal("Eagle Wharf Road");

      journey1 = { legs: [] };
      journey2 = {
        legs: [
          {
            summary: "Barbican",
          },
        ],
      };

      result = getDestination(journey1, journey2);
      expect(result).to.deep.equal("Barbican");
    });
  });
});
