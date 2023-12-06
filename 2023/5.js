const argv = require('minimist')(process.argv.slice(2));

const MAP_REGEX =
  /seeds|seed-to-soil|soil-to-fertilizer|fertilizer-to-water|water-to-light|light-to-temperature|temperature-to-humidity|humidity-to-location/gi;

class AlmanacMap {
  rangeMap = [];

  constructor(input) {
    input = input
      .split(',')
      .filter((entry) => !isNaN(entry) && entry !== '')
      .map((entry) => Number(entry));

    for (let index = 0; index < input.length; index += 3) {
      const destinationStart = input[index];
      const sourceStart = input[index + 1];
      const range = input[index + 2];
      this.rangeMap.push([
        [sourceStart, sourceStart + range - 1],
        [destinationStart, destinationStart + range - 1],
      ]);
    }

    this.rangeMap.sort((a, b) => a[0][0] - b[0][0]);
  }

  get(num) {
    num = Number(num);
    const range = this.rangeMap.find(
      (range) => num >= range[0][0] && num <= range[0][1]
    );

    return range ? range[1][0] + num - range[0][0] : num;
  }

  getRange([start, end]) {
    const ranges = [];
    for (let index = 0; index < this.rangeMap.length; index++) {
      const [source, destination] = this.rangeMap[index];
      const startIsWithinRange = start >= source[0] && start <= source[1];
      const endIsWithinRange = end >= source[0] && end <= source[1];

      if (startIsWithinRange && endIsWithinRange) {
        const newStart = destination[0] + start - source[0];
        const newEnd = destination[0] + end - source[0];
        ranges.push([newStart, newEnd]);
        return ranges;
      } else if (startIsWithinRange) {
        const newStart = destination[0] + start - source[0];
        const newEnd = destination[1];
        ranges.push([newStart, newEnd]);
        start = source[1] + 1;
      } else if (endIsWithinRange) {
        ranges.push([start, source[0] - 1]);
        const newStart = destination[0];
        const newEnd = destination[0] + end - source[0];
        ranges.push([newStart, newEnd]);
        return ranges;
      } else if (start < source[0] && end > source[1]) {
        ranges.push([start, source[0] - 1]);
        ranges.push([destination[0], destination[1]]);
        start = source[1] + 1;
      }
    }

    ranges.push([start, end]);
    return ranges;
  }
}

const parseArgv = (input) => {
  input = input.join(',').split(MAP_REGEX).slice(1);

  const seeds = input[0]
    .split(',')
    .filter((seed) => !isNaN(seed) && seed !== '');
  const seedToSoil = new AlmanacMap(input[1]);
  const soilToFertilizer = new AlmanacMap(input[2]);
  const fertilizerToWater = new AlmanacMap(input[3]);
  const waterToLight = new AlmanacMap(input[4]);
  const lightToTemperature = new AlmanacMap(input[5]);
  const temperatureToHumidity = new AlmanacMap(input[6]);
  const humidityToLocation = new AlmanacMap(input[7]);

  return {
    seeds,
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  };
};

const solvePart1 = (input) => {
  const locations = input.seeds.map((seed) => {
    const soil = input.seedToSoil.get(seed);
    const fertilizer = input.soilToFertilizer.get(soil);
    const water = input.fertilizerToWater.get(fertilizer);
    const light = input.waterToLight.get(water);
    const temp = input.lightToTemperature.get(light);
    const humidity = input.temperatureToHumidity.get(temp);
    return input.humidityToLocation.get(humidity);
  });
  return Math.min(...locations);
};

const solvePart2 = (input) => {
  const seedRanges = input.seeds
    .reduce((acc, seed, index) => {
      if (index % 2 === 0) {
        const start = Number(seed);
        const end = Number(seed) + Number(input.seeds[index + 1]);
        acc.push([start, end]);
      }
      return acc;
    }, [])
    .sort((a, b) => a[0] - b[0]);

  const locationRanges = seedRanges
    .map((seedRange) => {
      const soilRanges = input.seedToSoil.getRange(seedRange);
      const fertilizerRanges = soilRanges
        .map((range) => input.soilToFertilizer.getRange(range))
        .flat();
      const waterRanges = fertilizerRanges
        .map((range) => input.fertilizerToWater.getRange(range))
        .flat();
      const lightRanges = waterRanges
        .map((range) => input.waterToLight.getRange(range))
        .flat();
      const tempRanges = lightRanges
        .map((range) => input.lightToTemperature.getRange(range))
        .flat();
      const humidityRanges = tempRanges
        .map((range) => input.temperatureToHumidity.getRange(range))
        .flat();
      return humidityRanges
        .map((range) => input.humidityToLocation.getRange(range))
        .flat();
    })
    .flat();

  return Math.min(...locationRanges.map(([start, _]) => start));
};

const input = parseArgv(argv._);

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
