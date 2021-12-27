const csv = require('csv-parser');
const fs = require('fs');

const filepath = "./demo.csv"
let readStream = fs.createReadStream(filepath, {
    autoClose: true,
});
let MAX_LINE = 0;


readStream.on('error', (e) => {
        console.log(e);
        console.log("error");
    })

    .pipe(csv())
    .on('data', (row) => {

        if (MAX_LINE == 2) {
            process.kill(process.pid, 'SIGTERM')
            readStream.emit('end');
        }
        // console.log("not 2");
        MAX_LINE++
        console.log(row);
    })

    .on('end', () => {
        // handle end of CSV
        console.log("read done");
    }).on("close", function () {
        console.log("closed");
    })