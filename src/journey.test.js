import { expect } from "chai";

import { parseResults } from "./journey";
import * as fixture from './fixtures/sample-journey.json';

describe("Journey", () => {
  describe("parseResults", () => {
    it("should return correct result", () => {
      const result = parseResults(fixture);
      expect(result.legs.length).to.deep.equal(3);
      expect(result.legs[0].summary.length).to.be.above(0);
      expect(result.legs[0].lineString.length).to.be.above(0);
    });
  });
});
