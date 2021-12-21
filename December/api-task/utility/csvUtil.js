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

//records == jsonarray
//record = user

async function validateCsvData(records, fieldMap, fileId) {
    let validRecords = [];
    let discardredRecordsCount = 0;
    let duplicateRecordsCount = 0;
    let duplicateCsvRecordsCount = 0;
    let validRecordsCount = 0;

    for (const record of records) {
        let name = record[fieldMap.name];
        let email = record[fieldMap.email];
        let mobile = record[fieldMap.mobile];

        //skip record which has email or mobile duplicate
        if (checkDuplicateInCSV(email, mobile)) {
            duplicateCsvRecordsCount++;
            continue;
        }


        if (name && email && checkEmail(email) && mobile && checkMobile(mobile)) {
            let matchUser = await User.findOne({
                $or: [{
                    email: email
                }, {
                    mobile: mobile
                }],
            });
            let isExist = matchUser ? true : false;

            if (isExist) {
                duplicateRecordsCount++;
            } else {
                validRecordsCount++;
                let userObj = {};
                for (const field in fieldMap) {
                    userObj[field] = record[fieldMap[field]];
                }
                userObj["password"] = bcrypt.hashSync(email, 8);
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
        validRecordsCount,
        duplicateCsvRecordsCount
    }
}


module.exports = validateCsvData;