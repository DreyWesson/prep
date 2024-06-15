import fs from 'fs';

const data = fs.readFile("./data.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    }
    console.log(data);
    return data;
});
console.log(data);