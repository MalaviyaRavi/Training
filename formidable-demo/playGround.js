// const fs = require('fs');
// const readline = require('readline');
// let count = 0;

// const rl = readline.createInterface({
//     input: fs.createReadStream('./test.csv')
// });

// rl.on('line', function (line) {
//     if (count++ >= 3) {
//         console.log(`Line read: ${line}`);
//     }
// });

//throatlling
const throttle = function (func, delay) {
    let flag = true
    return new function () {
        if (flag) {
            func();
            flag = false;
            setTimeout(function () {
                flag = true
            }, delay)
        }
    }
}