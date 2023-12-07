const argv = require('minimist')(process.argv.slice(2));

const HIGH_CARD = 0,
  ONE_PAIR = 1,
  TWO_PAIR = 2,
  THREE_OF_A_KIND = 3,
  FULL_HOUSE = 4,
  FOUR_OF_A_KIND = 5,
  FIVE_OF_A_KIND = 6;

const standardDeck = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'].reduce(
  (deck, card, index) => ({ ...deck, [card]: index }),
  {}
);

const jokerDeck = ['J', 2, 3, 4, 5, 6, 7, 8, 9, 'T', 'Q', 'K', 'A'].reduce(
  (deck, card, index) => ({ ...deck, [card]: index }),
  {}
);

const parseArgv = (input) =>
  input.reduce((cards, token, index) => {
    if (index % 2 === 0) {
      const hand = {
        cards: `${token}`,
        bid: input[index + 1],
        counts: getCardCounts(`${token}`),
      };
      cards.push({ ...hand, type: getHandType(hand) });
    }
    return cards;
  }, []);

const getCardCounts = (cards) =>
  [...cards].reduce((counts, card) => {
    counts[card] = counts[card] ? counts[card] + 1 : 1;
    return counts;
  }, {});

const getHandType = (hand) => {
  const uniqueCards = Object.keys(hand.counts).length;
  const aCardAppearsTwice = Object.values(hand.counts).some(
    (count) => count === 2
  );
  const aCardAppearsThreeTimes = Object.values(hand.counts).some(
    (count) => count === 3
  );

  if (uniqueCards === 5) return HIGH_CARD;
  if (uniqueCards === 4) return ONE_PAIR;
  if (uniqueCards === 3) return aCardAppearsTwice ? TWO_PAIR : THREE_OF_A_KIND;
  if (uniqueCards === 2)
    return aCardAppearsThreeTimes ? FULL_HOUSE : FOUR_OF_A_KIND;
  return FIVE_OF_A_KIND;
};

const applyJokers = (hand) => {
  const jokers = hand.counts['J'];
  if (!jokers) return hand.type;
  if (hand.type === HIGH_CARD) return ONE_PAIR;
  if (hand.type === ONE_PAIR) return THREE_OF_A_KIND;
  if (hand.type === TWO_PAIR) return jokers === 2 ? FOUR_OF_A_KIND : FULL_HOUSE;
  if (hand.type === THREE_OF_A_KIND) return FOUR_OF_A_KIND;
  return FIVE_OF_A_KIND;
};

const getComparator = (deck) => (handA, handB) => {
  if (handA.type !== handB.type) {
    return handA.type - handB.type;
  } else {
    for (let i = 0; i < 5; i++) {
      if (deck[handA.cards[i]] !== deck[handB.cards[i]]) {
        return deck[handA.cards[i]] - deck[handB.cards[i]];
      }
    }
  }
  return 0;
};

const sumBidsByRank = (hands, deck) =>
  hands
    .sort(getComparator(deck))
    .reduce((total, hand, index) => total + hand.bid * (index + 1), 0);

const solvePart1 = (input) => sumBidsByRank(input, standardDeck);

const solvePart2 = (input) =>
  sumBidsByRank(
    input.map((hand) => ({ ...hand, type: applyJokers(hand) })),
    jokerDeck
  );

const input = parseArgv(argv._);

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
