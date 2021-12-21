const fs = require('fs');
const csv = require('@fast-csv/parse');


csv.parseFile('./public/csvs/admin@admin.com1639652751327.csv', {
        headers: headers => headers.map(function (value, index) {
            return "field" + (index + 1);
        }),
    })
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));




// async function getUsers() {
//     let users = await csv({
//         noheader: true,
//     }).fromFile("./public/csvs/admin@admin.com1639652751327.csv");
//     console.log(users);
// }

// getUsers();


// let users = [{
//     email: "admin@admin.com",
//     number: 123456
// }, {
//     email: "admin2@admin.com",
//     number: 123456
// }, {
//     email: "admin@admin.com",
//     number: 1234567
// }, {
//     email: "admin23@admin.com",
//     number: 1234574556
// }, {
//     email: "admin44@admin.com",
//     number: 12344654556
// }, {
//     email: "admin55@admin.com",
//     number: 12345556
// }, {
//     email: "admin7887@admin.com",
//     number: 12345697856
// }, ];


// let emails = [];
// let numbers = [];
// let filterUser = [];

// for (const user of users) {
//     let emailExist = emails.includes(user.email);
//     let numberExist = numbers.includes(user.number);
//     if (emailExist || numberExist) {
//         continue;
//     } else {
//         emails.push(user.email);
//         numbers.push(user.number);
//         filterUser.push(user);
//     }
// }


// console.log(filterUser);