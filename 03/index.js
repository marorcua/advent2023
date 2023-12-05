"use strict";
const data03 = require('fs')
    .readFileSync('input.txt', 'utf8')
    .toString()
    .split('\n');
const isSimbol = (letter) => {
    if (letter === '.' || !isNaN(+letter))
        return false;
    return true;
};
const checkSymbols = (chars) => {
    return chars.some((e) => isSimbol(e));
};
const lineCalc = (line) => {
    const characters = line.split('');
    let engine = { number: '', coordinates: [] };
    const engines = [];
    characters.forEach((element, index) => {
        if (!isNaN(+element)) {
            engine.number += element;
            engine.coordinates.push(index);
            if (index === characters.length - 1) {
                engines.push(engine);
            }
        }
        else {
            engines.push(engine);
            engine = { number: '', coordinates: [] };
        }
    });
    return engines.filter((e) => e.number !== '');
};
const getallCoordinates = (line, coordinates) => {
    const firstCoordinate = coordinates[0] - 1 >= 0 ? coordinates[0] - 1 : coordinates[0];
    const finalCoordinate = coordinates[coordinates.length - 1] + 2 > line.length
        ? line.length
        : coordinates[coordinates.length - 1] + 2;
    const lineCoordinates = line.split('').slice(firstCoordinate, finalCoordinate);
    return lineCoordinates;
};
const detectSymbol = (lineData, line, prevLine, nextLine) => {
    console.log('+++++++++ detecting symbols ++++++++++++');
    const { engines } = lineData;
    const enginesWithSymbols = [];
    engines.forEach((engine) => {
        const { coordinates } = engine;
        const prevLineChars = prevLine
            ? getallCoordinates(prevLine, coordinates)
            : [];
        const nextLineChars = nextLine
            ? getallCoordinates(nextLine, coordinates)
            : [];
        const lineChars = getallCoordinates(line, coordinates);
        console.log('line data ', engine);
        console.log('prev line', prevLineChars);
        console.log('next line', nextLineChars);
        const charsToCheck = [...prevLineChars, ...nextLineChars, ...lineChars];
        const anySymbolFound = checkSymbols(charsToCheck);
        if (anySymbolFound)
            enginesWithSymbols.push(engine);
    });
    return enginesWithSymbols;
};
const starCalc = (line, lineNumber) => {
    //do this line contain any star
    const stars = [];
    line.split('').forEach((e, i) => {
        if (e === '*') {
            stars.push({
                position: i,
                lineNumber,
            });
        }
    });
    return stars;
};
const fillArray = (start, finish) => {
    const list = [];
    for (let i = start; i <= finish; i++) {
        list.push(i);
    }
    return list;
};
const intersectArrays = (numberPositions, starPositions) => {
    return numberPositions.some((e) => starPositions.includes(e));
};
const adyacentNumbers = (starPosition, currentLine, numberArrays) => {
    const { position } = starPosition;
    const initial = position - 1 >= 0 ? position - 1 : 0;
    const final = position + 1 > currentLine.length ? currentLine.length : position + 1;
    const intersectedNumbersForStar = [];
    //engines for this star
    const engines = numberArrays.map((e) => e.engines).flat();
    engines.forEach((elm) => {
        const intersects = intersectArrays(elm.coordinates, fillArray(initial, final));
        if (intersects)
            intersectedNumbersForStar.push(elm);
    });
    console.log('intersected numbers', intersectedNumbersForStar);
    return intersectedNumbersForStar;
};
function processLines(data) {
    let positions = data.map((e, i) => ({ engines: lineCalc(e), lineNumber: i }));
    positions = positions.filter((e) => e.engines.length > 0);
    //for each position detect if next to it there are any symbol
    //treating all lines
    const enginesWithSymbols = [];
    positions.forEach((e) => {
        console.log('analyzing ', e.engines);
        const { lineNumber } = e;
        const symbolsDetected = detectSymbol(e, data[lineNumber], data[lineNumber - 1], data[lineNumber + 1]);
        console.log('symbols detected', symbolsDetected);
        enginesWithSymbols.push(...symbolsDetected);
    });
    console.log('engines with symbols ', enginesWithSymbols);
    const result = enginesWithSymbols.reduce((acc, elm) => {
        const engineNumber = +elm.number;
        if (isNaN(engineNumber))
            return acc;
        return acc + engineNumber;
    }, 0);
    console.log(result);
    return result;
}
function processSecondPart(data) {
    //we get all number positions
    let numberPositions = data.map((e, i) => ({
        engines: lineCalc(e),
        lineNumber: i,
    }));
    numberPositions = numberPositions.filter((e) => e.engines.length > 0);
    const starPositions = data.reduce((acc, elm, ind) => {
        const stars = starCalc(elm, ind);
        acc.push(...stars);
        return acc;
    }, []);
    //now for every star in every line, we pass that star position and numbers in prev, current and next lines
    const resultArray = [];
    starPositions.forEach((elm) => {
        const { lineNumber } = elm;
        const filteredNumberPositions = numberPositions.filter((e) => e.lineNumber === lineNumber ||
            e.lineNumber === lineNumber - 1 ||
            e.lineNumber === lineNumber + 1);
        //we obtain the adyacent numbers
        const intersectedNumbersForStar = adyacentNumbers(elm, data[lineNumber], filteredNumberPositions);
        //we multiply this intersection if it has more than 1 item
        if (intersectedNumbersForStar.length === 2) {
            const power = intersectedNumbersForStar.reduce((acc, elm) => {
                const gear = +elm.number;
                if (typeof gear !== 'number')
                    return acc;
                return gear * acc;
            }, 1);
            console.log('poer ', power, ' from intersection ', intersectedNumbersForStar);
            resultArray.push(power);
        }
    });
    const result = resultArray.reduce((acc, elm) => acc + elm, 0);
    console.log('result: ', result);
}
processSecondPart(data03);
