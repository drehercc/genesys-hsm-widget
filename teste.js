let x = "ola {{1}} senhor {{nome}}."
const regex = /{{\w*}}/g;
const found = x.match(regex);


console.log(found)