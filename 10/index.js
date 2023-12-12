import fs from 'fs/promises';
const input = await fs.readFile('input.txt', 'utf-8');
const data = input.split(/\n/g);
const lines = data.map((e) => e.split(''));
function searchForStart(arr) {
    let coordinates = [0, 0];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.indexOf('S') > -1)
            return (coordinates = [element.indexOf('S'), index]);
    }
    return coordinates;
}
function translateSign(key, initial) {
    let go = [
        [0, 0],
        [0, 0],
    ];
    switch (key) {
        case '|':
            go = [
                [0, -1],
                [0, +1],
            ];
            break;
        case '-':
            go = [
                [-1, 0],
                [1, 0],
            ];
            break;
        case 'L':
            go = [
                [0, -1],
                [1, 0],
            ];
            break;
        case 'J':
            go = [
                [0, -1],
                [-1, 0],
            ];
            break;
        case '7':
            go = [
                [0, 1],
                [-1, 0],
            ];
            break;
        case 'F':
            go = [
                [0, 1],
                [1, 0],
            ];
            break;
        default:
            break;
    }
    const prev = addPositions(go[0], initial);
    const next = addPositions(go[1], initial);
    const connection = [prev, next];
    return connection;
}
const addPositions = (pos1, pos2) => {
    const addX = pos1[0] + pos2[0] >= 0 ? pos1[0] + pos2[0] : 0;
    const addY = pos1[1] + pos2[1] >= 0 ? pos1[1] + pos2[1] : 0;
    return [addX, addY];
};
const findPosition = (map, coordinate) => map[coordinate[1]][coordinate[0]];
const areEqual = (arr1, arr2) => arr1[0] === arr2[0] && arr1[1] === arr2[1];
function travelPipe(arr, paths = [[], []], count = 1) {
    console.log(paths);
    while (!areEqual(paths[0][paths[0].length - 1], paths[1][paths[1].length - 1])) {
        paths.forEach((path, ind) => {
            const coord = path[path.length - 1];
            const symbol = findPosition(lines, coord);
            const nexts = translateSign(symbol, coord);
            console.log('nexts', nexts);
            console.log('path', path);
            const next = path.some((e) => areEqual(nexts[0], e)) ? nexts[1] : nexts[0];
            console.log('next', next);
            paths[ind].push(next);
        });
        count++;
        console.log('count', count);
    }
    //   for (let index = 0; index < arr.length; index++) {
    //     const elm = arr[index]
    //     const symbol = findPosition(lines, elm)
    //     const nexts = translateSign(symbol, elm)
    //     const prevPath = path[index]
    //     const next = prevPath.some((prev) => areEqual(nexts[0], prev))
    //       ? nexts[1]
    //       : nexts[0]
    //     arr[index] = next
    //     path[index].push(next)
    //   }
    //   const firstPath = path[0]
    //   const secondPath = path[1]
    //   if (
    //     areEqual(firstPath[firstPath.length - 1], secondPath[secondPath.length - 1])
    //   ) {
    //     console.log('equal ', path)
    //     return count
    //   }
    return count;
}
function part1() {
    //first we get the starting point
    const start = searchForStart(lines);
    //then we get the rest of the items
    const up = addPositions(start, [0, -1]);
    const down = addPositions(start, [0, 1]);
    const left = addPositions(start, [-1, 0]);
    const right = addPositions(start, [1, 0]);
    const startings = [up, down, left, right].filter((e) => !(e[0] === start[0] && e[1] === start[1]));
    //of the starting points we get the signs
    const startingSymbols = startings.map((e) => findPosition(lines, e));
    const initialTranslations = startingSymbols.map((e, i) => translateSign(e, startings[i]));
    const startingPoints = startings.filter((e, i) => initialTranslations[i].some((elm) => areEqual(elm, start)));
    const result = travelPipe(startingPoints, [
        [start, startingPoints[0]],
        [start, startingPoints[1]],
    ]);
    console.log('result: ', result);
}
part1();
