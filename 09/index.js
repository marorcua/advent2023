import fs from 'fs/promises';
const input = await fs.readFile('input.txt', 'utf-8');
const data = input.split(/\n/g);
const lines = data.map((e) => e.split(' ').map(Number));
const addPlaceholders = (arr) => {
    const lastElem = arr[0];
    return lastElem[lastElem.length - 1];
    //   arr.reduce((arr, elm) => {
    //     const lastIndex = elm.length - 1
    //     return arr + elm[lastIndex]
    //   }, 0)
};
const fillPlaceholder = (arr) => {
    for (let index = arr.length - 2; index >= 0; index--) {
        let element = 0;
        const currElement = arr[index];
        const prevElement = arr[index + 1];
        element =
            prevElement[prevElement.length - 1] + currElement[prevElement.length - 1];
        arr[index].push(element);
    }
    return arr;
};
const fillZeroes = (arr) => {
    for (let index = arr.length - 2; index >= 0; index--) {
        let element = 0;
        const currElement = arr[index];
        const prevElement = arr[index + 1];
        element = currElement[0] - prevElement[0];
        arr[index].unshift(element);
    }
    return arr;
};
const getArrOfDifferences = (arr, currentArr) => {
    //given an array, get all array differences
    const newArr = getDifferenceArr(arr);
    currentArr.push(newArr);
    if (newArr.some((e) => e !== 0)) {
        getArrOfDifferences(newArr, currentArr);
    }
    return currentArr;
};
const getDifferenceArr = (array) => {
    return array.reduce((acc, elm, ind, arr) => {
        if (ind === 0)
            return acc;
        const newElem = elm - arr[ind - 1];
        acc.push(newElem);
        return acc;
    }, []);
};
function part1() {
    const structuredData = [];
    let finalPyramid = [];
    let result = 0;
    lines.forEach((elm) => {
        const pyramid = getArrOfDifferences(elm, [elm]);
        structuredData.push(pyramid);
        const newPlaceHolders = fillPlaceholder(pyramid);
        finalPyramid = newPlaceHolders;
        result = result + addPlaceholders(newPlaceHolders);
    });
    console.log('pyramid', structuredData);
    console.log('final pyramid', finalPyramid);
    console.log('result:  ', result);
}
function part2() {
    const structuredData = [];
    let finalPyramid = [];
    let result = 0;
    lines.forEach((elm) => {
        const pyramid = getArrOfDifferences(elm, [elm]);
        structuredData.push(pyramid);
        const newPlaceHolders = fillZeroes(pyramid);
        finalPyramid = newPlaceHolders;
        result = result + newPlaceHolders[0][0];
    });
    console.log('final result:  ', result);
}
// part1()
part2();
