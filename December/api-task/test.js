function XOR_hex(a, b) {
    var res = "",
        i = a.length,
        j = b.length;
    while (i-- > 0 && j-- > 0)
        res = (parseInt(a.charAt(i), 32) ^ parseInt(b.charAt(j), 32)).toString(32) + res;
    return res;
}


let x = 3 ^ 4 ^ 5
console.log(x ^ 6);


// let value = XOR_hex("abc", "xyz");

// console.log(value);

// let value2 = XOR_hex(value, "mrm");

// console.log(value2);

// console.log(XOR_hex(value2, "abc"));
// let array = ["abc", "xyz", "mnr", "abc", "pqr", "hhj", "abc", "rrr", "ggg", "jjj", "xyz"];
// let output = [];
// let result = XOR_hex(array[0], array[1]);
// if ((/^0*$/.test(result))) {
//     output.push(array[0]);
// } else {
//     output.push(array[0]);
//     output.push(array[1]);
// }
// for (const value of array.slice(2)) {
//     if (/^0*$/.test(XOR_hex(result, value))) {
//         console.log(value, XOR_hex(result, value));
//         continue;
//     } else {
//         result = XOR_hex(value, result);
//         output.push(value);
//     }
// }

// console.log(output);