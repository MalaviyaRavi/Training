const csv = require("csvtojson");
async function getUsers() {
    let users = await csv({
        noheader: true,
    }).fromFile("./public/csvs/users-2021-12-15 12:16 pm.csv");
    console.log(users);
}

getUsers();