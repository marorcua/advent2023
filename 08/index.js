import fs from 'fs/promises';
const input = await fs.readFile('input.txt', 'utf-8');
const data = input.split(/\n/g);
const directions = data.slice(0, 1);
const labyrinth = data.slice(1, data.length).filter((e) => e);
const labyrinthStructure = (lab) => {
    const structuredArray = lab.reduce((acc, elm) => {
        const [item, joinedComponents] = elm.split(' = ');
        const components = joinedComponents
            .replace(/\(|\)/g, '')
            .split(', ');
        acc[item.trim()] = components;
        return acc;
    }, { '': ['', ''] });
    delete structuredArray[''];
    return structuredArray;
};
const structuredData = labyrinthStructure(labyrinth);
function goThroughElements(receivedDirections, countReceived, last) {
    let lastObtained = last;
    let count = Number.MAX_SAFE_INTEGER;
    count = countReceived;
    let directions = receivedDirections;
    for (let index = 0; index < receivedDirections.length; index++) {
        const element = directions[index];
        let next = element === 'R' ? 1 : 0;
        if (!lastObtained || lastObtained === '') {
            console.log('no last obtained', lastObtained);
            lastObtained = Object.keys(structuredData)[0];
        }
        lastObtained = structuredData[lastObtained][next];
        ++count;
        receivedDirections.push(element);
        if (lastObtained === 'ZZZ') {
            return { count, lastObtained };
        }
    }
    return { count, lastObtained };
}
const nextNodes = () => {
    return nextNodes;
};
function goThroughNodes(receivedDirections, nodes) {
    let count = 0;
    let finalNodes = nodes;
    let resultArrays = nodes.map((e) => []);
    for (let index = 0; index < receivedDirections.length; index++) {
        const element = receivedDirections[index];
        let next = element === 'R' ? 1 : 0;
        finalNodes = finalNodes.map((e) => structuredData[e][next]);
        const finalLetters = finalNodes.map((e) => e.split('').pop());
        receivedDirections.push(element);
        ++count;
        finalNodes.forEach((element, ind) => {
            const letter = element.split('').pop();
            if (letter === 'Z')
                resultArrays[ind].push(count);
        });
        if (finalLetters.every((e) => e === 'Z') ||
            resultArrays.every((e) => e.length >= 2)) {
            return { count, resultArrays };
        }
    }
    return { count, resultArrays };
}
function getNodes() {
    return Object.keys(structuredData).filter((e) => e.split('')[2] === 'A');
}
function part1() {
    const directionsArray = directions[0].split('');
    //first we create the right type of array
    let { count, lastObtained } = goThroughElements(directionsArray, 0, 'AAA');
    console.log('response :', count, lastObtained);
}
function part2() {
    const startingNodes = getNodes();
    const directionsArray = directions[0].split('');
    const { resultArrays } = goThroughNodes(directionsArray, startingNodes);
    console.log('result is the LCM of ', resultArrays);
    let arr = resultArrays.map((e) => e[0]);
    function gcd(a, b) {
        let t = 0;
        a < b && ((t = b), (b = a), (a = t)); // swap them if a < b
        t = a % b;
        return t ? gcd(b, t) : b;
    }
    const result = arr.reduce((a, b) => (a / gcd(a, b)) * b);
    console.log('result ', result);
}
// part1()
part2();
