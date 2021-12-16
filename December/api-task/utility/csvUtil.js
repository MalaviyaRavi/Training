const User = require("../models/user")
const bcrypt = require("bcrypt")

function checkEmail(email) {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

function checkMobile(mobile) {
    let validRegex = /^[0-9]{10}$/;
    return mobile.match(validRegex);
}



let validRecords = [];
let discardredRecordsCount = 0;
let duplicateRecordsCount = 0;
let validRecordsCount = 0;
let emailObject = {};
let mobileObject = {};

function checkDuplicateInCSV(email, mobile) {
    if (emailObject.hasOwnProperty(email) || mobileObject.hasOwnProperty(mobile)) {
        return true;
    } else {
        emailObject[email] = 1;
        mobileObject[mobile] = 1;
        return false;
    }
}

async function validateCsvData(records, fieldMap, fileId) {

    for (const record of records) {

        if (checkDuplicateInCSV(record[fieldMap.email], record[fieldMap.mobile])) {
            continue;
        }
        if (record[fieldMap.name] && record[fieldMap.email] && checkEmail(record[fieldMap.email]) && record[fieldMap.mobile] && checkMobile(record[fieldMap.mobile])) {
            let matchUser = await User.findOne({
                $or: [{
                    email: record[fieldMap.email]
                }, {
                    mobile: record[fieldMap.mobile]
                }],
            });

            let isExist = matchUser ? true : false;

            if (isExist) {
                duplicateRecordsCount++;
            } else {
                validRecordsCount++;
                let userObj = {};
                userObj["name"] = record[fieldMap.name];
                userObj["email"] = record[fieldMap.email];
                userObj["mobile"] = record[fieldMap.mobile];
                userObj["password"] = bcrypt.hashSync(record[fieldMap.email], 8);
                userObj["addedBy"] = fileId;
                validRecords.push(userObj);
            }
        } else {
            discardredRecordsCount++;
        }
    }

    return {
        validRecords,
        duplicateRecordsCount,
        discardredRecordsCount,
        validRecordsCount
    }
}


module.exports = validateCsvData;