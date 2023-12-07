import fs from 'fs/promises';
const input = await fs.readFile('input.txt', 'utf-8');
const data = input.split(/\n/g);
function getHandType(hand) {
    const counts = {};
    hand.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
    });
    const sortedCards = Object.entries(Object.assign({}, { ...counts })).sort(([c, a], [d, b]) => {
        if (a !== b) {
            return b - a;
        }
        else {
            return bestCard(c, d, 0);
        }
    });
    //   const map = new Map()
    //   for (let value of newEntries) {
    //     map.set(value[0], value[1])
    //   }
    return sortedCards;
}
function getHandTypeWithJoker(hand) {
    let counts = {};
    hand.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
    });
    let sortedCards = Object.entries(Object.assign({}, { ...counts })).sort(([c, a], [d, b]) => {
        if (a !== b) {
            return b - a;
        }
        else {
            return bestCard(c, d, 1);
        }
    });
    if (sortedCards.filter((e) => e[0] === 'J').length > 0) {
        const jokerCards = sortedCards.filter((e) => e[0] === 'J');
        sortedCards = sortedCards.filter((e) => e[0] !== 'J');
        if (!sortedCards[0]) {
            sortedCards = jokerCards;
            return sortedCards;
        }
        sortedCards[0][1] =
            (sortedCards[0] ? sortedCards[0][1] : 0) + jokerCards[0][1];
    }
    return sortedCards;
}
function decideRankByCard(handOne, handTwo, depth, rank = 0) {
    if (handOne.sortedHand[0][1] > handTwo.sortedHand[0][1]) {
        //{ firstHand: handOne, secondHand: handTwo }
        return 1;
    }
    else if (handOne.sortedHand[0][1] < handTwo.sortedHand[0][1]) {
        return -1;
    }
    //FULL HOUSE BETTER THAN 3 OF A KIND
    const nextCard = 1;
    if (handOne.sortedHand[nextCard] && handTwo.sortedHand[nextCard]) {
        if (handOne.sortedHand[nextCard][1] > handTwo.sortedHand[nextCard][1]) {
            return 1;
        }
        else if (handTwo.sortedHand[nextCard][1] > handOne.sortedHand[nextCard][1]) {
            return -1;
        }
    }
    if (-bestCard(handOne.originalHand[0][depth], handTwo.originalHand[0][depth], rank) > 0) {
        //A is greater than B
        return 1;
    }
    else if (-bestCard(handOne.originalHand[0][depth], handTwo.originalHand[0][depth], rank) < 0) {
        // return { firstHand: handOne, secondHand: handTwo }
        return -1;
    }
    //if same rank, next card
    if (!handOne.originalHand[0][depth + 1])
        return 0;
    return decideRankByCard(handOne, handTwo, depth + 1, rank);
}
function bestCard(cardA, cardB, rank) {
    const rankOrder = [
        ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'],
        ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'],
    ];
    return rankOrder[rank].indexOf(cardA) - rankOrder[rank].indexOf(cardB);
}
function orderHands(data) {
    const hands = data.map((e, i) => {
        const { hand, points } = e;
        return {
            sortedHand: getHandType(hand.split('')),
            rank: points,
            originalHand: [hand.split('')],
        };
    });
    const orderedHands = hands.sort((a, b) => decideRankByCard(a, b, 0));
    return orderedHands;
}
function orderHandsWithJoker(data) {
    const hands = data.map((e, i) => {
        const { hand, points } = e;
        return {
            sortedHand: getHandTypeWithJoker(hand.split('')),
            rank: points,
            originalHand: [hand.split('')],
        };
    });
    const orderedHands = hands.sort((a, b) => decideRankByCard(a, b, 0, 1));
    return orderedHands;
}
function part1(data) {
    const handsData = data.map((e) => ({
        hand: e.split(' ')[0],
        points: +e.split(' ')[1],
    }));
    const orderWithPoints = orderHands(handsData);
    //   let result = Number.MAX_SAFE_INTEGER
    const result = orderWithPoints.reduce((acc, elm, ind) => {
        return acc + elm.rank * (ind + 1);
    }, 0);
    console.log('result:  ', result);
    return result;
}
function part2(data) {
    const handsData = data.map((e) => ({
        hand: e.split(' ')[0],
        points: +e.split(' ')[1],
    }));
    const orderWithPoints = orderHandsWithJoker(handsData);
    const result = orderWithPoints.reduce((acc, elm, ind) => {
        return acc + elm.rank * (ind + 1);
    }, 0);
    console.log('result:', result);
    return result;
}
// part1(data)
part2(data);
