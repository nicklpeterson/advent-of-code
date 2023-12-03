const argv = require('minimist')(process.argv.slice(2));

class Schematic {
  schematic;
  length;

  constructor(input) {
    this.schematic = input.map((line) => line.split(''));
    this.length = this.schematic.length;
  }

  get(row, col) {
    return this.schematic[row] ? this.schematic[row][col] : undefined;
  }

  getRow(row) {
    return this.schematic[row];
  }

  reduce(handler, initialValue = 0) {
    let result = initialValue;

    for (let row = 0; row < schematic.length; row++) {
      for (let col = 0; col < schematic.getRow(row).length; col++) {
        const cell = this.get(row, col);
        const [nextResult, nextRow, nextCol] =
          handler(result, cell, row, col) ?? [];
        result = nextResult ?? result;
        row = nextRow ?? row;
        col = nextCol ?? col;
      }
    }

    return result;
  }

  isAdjacentTo(row, col, comparator) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const cell = this.get(row + i, col + j);
        if (comparator(cell)) return true;
      }
    }
    return false;
  }

  isAdjacentToSymbol(row, col) {
    return this.isAdjacentTo(
      row,
      col,
      (cell) => cell !== undefined && isNaN(cell) && cell !== '.'
    );
  }

  getAllAdjacentNumbers(row, col) {
    const adjacentNumbers = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const cell = this.get(row + i, col + j);
        if (!isNaN(cell)) {
          const [num, index] = this.getNumber(row + i, col + j);
          j = index - col;
          adjacentNumbers.push(num);
        }
      }
    }

    return adjacentNumbers;
  }

  getNumber(row, col) {
    const entireRow = this.getRow(row);
    const digits = [entireRow[col]];

    for (let left = col - 1; !isNaN(entireRow[left]); left--)
      digits.unshift(entireRow[left]);

    let right = col + 1;
    while (!isNaN(entireRow[right])) digits.push(entireRow[right++]);

    return [Number(digits.join('')), right - 1];
  }
}

const solvePart1 = (schematic) => {
  return schematic.reduce((acc, cell, row, col) => {
    if (!isNaN(cell) && schematic.isAdjacentToSymbol(row, col)) {
      const [partNumber, nextCol] = schematic.getNumber(row, col);
      return [acc + partNumber, row, nextCol];
    }
  });
};

const solvePart2 = (schematic) => {
  return schematic.reduce((acc, cell, row, col) => {
    if (cell === '*') {
      const adjacentNumbers = schematic.getAllAdjacentNumbers(row, col);
      if (adjacentNumbers.length === 2) {
        return [(acc += adjacentNumbers[0] * adjacentNumbers[1])];
      }
    }
  });
};

const schematic = new Schematic(argv._);

console.log('Part 1 - ', solvePart1(schematic));
console.log('Part 2 - ', solvePart2(schematic));
