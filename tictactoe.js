const arr = Array(3).fill(null).map(() => Array(3).fill(null))

function checkRows(array) {
    let i, j = 0;
    for (i = 0; i < array.length; i++) {
        j = 0;
        const element = array[i][j];
        for (j; j < array[i].length; j++) {
            const element2 = array[i][j];
            if (element && element != element2)
                break;
            if (element && j == array.length - 1) return arr[i];
        }
    }
    return [];
}
function checkCols(array) {
    let i, j = 0;
    for (i = 0; i < 1; i++) {
        for (j = 0; j < array.length; j++) {
            const element = array[i][j];
            if (element && array[i + 1][j] === element && array[i + 2][j] === element)
                return [arr[j][j], arr[j+1][j], arr[j+2][j]];
        }
    }
    return [];
}
function checkDiags(arr) {
    const center = arr[1][1];
    if (center && arr[0][0] === center && arr[2][2] === center)
        return [arr[0][0], center, arr[2][2]];
    if (center && arr[0][2] === center && arr[2][0] === center)
        return [arr[0][2], center, arr[2][0]];
    return [];
}
function checkWinner(arr) {
    let res = checkCols(arr);
    if (res.length === 0) {
        res = checkRows(arr);
        if (res.length === 0)
            res = checkDiags(arr);
    }
    return res;
}

console.log(checkWinner(arr));
