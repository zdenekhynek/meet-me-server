import { expect } from "chai";

import { parseCoordString, getMidpointBetweenCoords } from "./utils";

describe("Utils", () => {
  describe("parseCoordString", () => {
    it("should parse string into array of numbers", () => {
      expect(parseCoordString("20.2,20.1")).to.deep.equal([20.2, 20.1]);
      expect(() => parseCoordString("")).to.throw();
      expect(() => parseCoordString("12")).to.throw();
      expect(() => parseCoordString("12,1235,523")).to.throw();
    });
  });

  describe("getMidpointBetweenCoords", () => {
    it("should return correct midpoint", () => {
      expect(getMidpointBetweenCoords([20, 10], [10, 5])).to.deep.equal([
        15, 7.5
      ]);
      expect(() => getMidpointBetweenCoords("")).to.throw();
      expect(() => getMidpointBetweenCoords([20], [20, 20])).to.throw();
    });
  });
});
