const fs = require('fs');
const path = require('node:path')
const dataPath = path.join(__dirname, 'P-1_data_humidity.dat')
const t = fs.readFileSync(dataPath);
const t_string = t.toString();

console.log(t)

var fileSplit = t_string.split("\n");
console.log(fileSplit)

const stringTest = "hello"
const valueString = stringTest.value;
console.log(stringTest)