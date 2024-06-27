let list = {
    value: 1,
    next: {
        value: 2,
        next: {
            value: 3,
            next: {
                value: 14,
                next: null,
            },
        },
    },
};

function sumVal(list) {
    let value = 0;
    for (const subList of Object.values(list)) {
        value += !isNaN(subList) ? subList : sumVal(subList);
    }
    return value;
}

console.log(sumVal(list));
