import fs from 'fs/promises';
const input = await fs.readFile('input.txt', 'utf-8');
const data = input.split(/\n/g);
const map = data.map((e) => e.split(''));
const insert = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index),
];
const createSpaceMap = () => {
    //first rows
    let newMap = [...map];
    let addRows = [];
    map.forEach((row, ind) => {
        const result = row.reduce((acc, elm) => (elm === '#' ? acc + 1 : acc), 0);
        if (result === 0)
            addRows.push(ind);
    });
    addRows.forEach((elm, ind) => {
        const newArray = new Array(newMap[0].length).fill('.');
        newMap = insert(newMap, elm + ind, newArray);
    });
    const rowlength = map[0].length;
    let addCols = [];
    for (let index = 0; index < rowlength; index++) {
        const result = map.reduce((acc, elm) => (elm[index] === '#' ? acc + 1 : acc), 0);
        if (result === 0) {
            addCols.push(index);
        }
    }
    addCols.forEach((elm, ind) => {
        newMap = newMap.map((e) => [
            ...e.slice(0, elm + ind),
            '.',
            ...e.slice(elm + ind),
        ]);
    });
    //   newMap.map((e) => console.log(JSON.stringify(e)))
    return newMap;
};
const expandSpaceMap = () => {
    //first rows
    let newMap = [...map];
    let addRows = [];
    map.forEach((row, ind) => {
        const result = row.reduce((acc, elm) => (elm === '#' ? acc + 1 : acc), 0);
        if (result === 0)
            addRows.push(ind);
    });
    addRows.forEach((elm, ind) => {
        const newArray = new Array(newMap[0].length).fill('*');
        newMap[elm] = newArray;
        // newMap = insert(newMap, elm + ind, newArray)
    });
    const rowlength = newMap[0].length;
    let addCols = [];
    for (let index = 0; index < rowlength; index++) {
        const result = newMap.reduce((acc, elm) => (elm[index] === '#' ? acc + 1 : acc), 0);
        if (result === 0) {
            addCols.push(index);
        }
    }
    addCols.forEach((elm, ind) => {
        newMap.forEach((e) => (e[elm] = '*'));
        // [...e.slice(0, elm), '*', ...e.slice(elm + ind)]
    });
    return newMap;
};
function distanceCalc(firstElement, secondElement) {
    return [
        firstElement[0] - secondElement[0],
        firstElement[1] - secondElement[1],
    ];
}
function calculateDistance(starMap) {
    const getPositions = starMap.reduce((acc, e, i) => {
        const stars = e.forEach((galaxy, pos) => {
            if (galaxy === '#')
                acc.push([i, pos]);
        });
        return acc;
    }, []);
    let distance = 0;
    let pairs = 0;
    for (let index = 0; index < getPositions.length; index++) {
        const newArray = getPositions.slice(index);
        if (newArray.length <= 1) {
            return distance;
        }
        newArray.forEach((position) => {
            const firstElement = getPositions[index];
            const [x, y] = distanceCalc(firstElement, position);
            distance = distance + Math.abs(x) + Math.abs(y);
            pairs++;
        });
    }
}
function calcPath(starMap, position, distance) {
    const [y, x] = position;
    const [height, width] = distance;
    const hStart = width < 0 ? x + width : x;
    const vStart = height < 0 ? y + height : y;
    const horizontal = starMap[y].slice(hStart, Math.abs(width) + hStart);
    const vertical = starMap.reduce((acc, elm, ind) => {
        if (ind >= vStart && ind <= Math.abs(height) + vStart - 1) {
            acc.push(elm[width < 0 ? hStart : hStart + width]);
        }
        return acc;
    }, []);
    return [...horizontal, ...vertical];
}
function calculateExpansion(starMap) {
    const getPositions = starMap.reduce((acc, e, i) => {
        const stars = e.forEach((galaxy, pos) => {
            if (galaxy === '#')
                acc.push([i, pos]);
        });
        return acc;
    }, []);
    let distance = 0;
    let pairs = 0;
    for (let index = 0; index < getPositions.length; index++) {
        const newArray = getPositions.slice(index);
        if (newArray.length <= 1) {
            console.log('obtained distance:', distance, ' with # of pairs:', pairs);
            return distance;
        }
        newArray.forEach((position) => {
            const firstElement = getPositions[index];
            const dist = distanceCalc(position, firstElement);
            const path = calcPath(starMap, firstElement, dist);
            distance = distance + translatePath(path);
            pairs++;
        });
    }
}
function translatePath(path) {
    let result = 0;
    path.forEach((e) => {
        if (e === '*') {
            result = result + 1000000;
        }
        else {
            result++;
        }
    });
    return result;
}
function part1() {
    const sky = createSpaceMap();
    calculateDistance(sky);
}
function part2() {
    const sky = expandSpaceMap();
    calculateExpansion(sky);
}
part2();
