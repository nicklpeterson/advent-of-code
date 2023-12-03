const argv = require('minimist')(process.argv.slice(2));

const numbers = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
  hundred: '100',
  thousand: '1000',
};

const solvePart1 = (lines) =>
  lines.reduce(
    (result, line) => getValueOfLine(line, getNumberDigits) + result,
    0
  );

const solvePart2 = (lines) =>
  lines.reduce(
    (result, line) => getValueOfLine(line, getNumberAndStringDigits) + result,
    0
  );

const getValueOfLine = (line, getDigits) => {
  const digits = getDigits(line);

  return Number(digits[0]) * 10 + Number(digits[1]);
};

const getNumberDigits = (line) =>
  Array.from(line.toString()).reduce((digits, char) => {
    if (!Number(char)) {
      return digits;
    }

    return updateDigits(digits, char);
  }, []);

const getNumberAndStringDigits = (line) => {
  line = line.toString();
  let digits = [];
  for (let left = 0; left < line.length; left++) {
    for (let right = left; right <= line.length; right++) {
      if (left === right && Number(line[left])) {
        digits = updateDigits(digits, line[left]);
      }

      const substring = line.slice(left, right);
      const number = numbers[substring];

      if (number) {
        digits = updateDigits(digits, number);
      }
    }
  }

  return digits.length === 0 ? [0, 0] : digits;
};

const updateDigits = (digits, numberStr) => {
  if (digits.length === 0) {
    return [numberStr[0], numberStr[numberStr.length - 1]];
  } else {
    return [digits[0], numberStr[numberStr.length - 1]];
  }
};

const lines = argv._;

console.log('Part 1 - ', solvePart1(lines));
console.log('Part 2 - ', solvePart2(lines));
