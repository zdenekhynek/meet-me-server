export const parseCoordString = (coordString) => {
  if (!coordString) {
    throw new Error("Input is missing");
  }

  const arr = coordString.split(",");
  if (arr.length !== 2) {
    throw new Error(`Input: ${coordString} has invalid format.`);
  }

  return coordString.split(",").map(parseFloat);
};


export const getMidpointBetweenCoords = (coord1, coord2) => {
  if (coord1.length !== 2 || coord2.length !== 2) {
    throw new Error("Incorrect coordinates")
  }
  
  const [x1, y1] = coord1;
  const [x2, y2] = coord2;
  const x = (x1 + x2) / 2;
  const y = (y1 + y2) / 2;

  return [x, y];
};
