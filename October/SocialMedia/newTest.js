let wordMap = {
  2: "abc",
  3: "def",
  4: "ghi",
  5: "jkl",
  6: "mno",
  7: "pqrs",
  8: "tuv",
  9: "wxyz",
};

let inputStr = "444444005555556666668888883333300344444499999999922225551444";
//   444444005555556666668888883333300334444449999999992222555444
//  44444400555555666666888888333330034444449999999992222555444

let splits = [];
let tempString = inputStr[0];
let validDigits = ["0", "2", "3", "4", "5", "6", "7", "8", "9"];
let i = 1;

let iStr = inputStr.replace(/[1*#]/g, "");

while (i < iStr.length) {
  if (iStr[i] != iStr[i - 1]) {
    splits.push(tempString);
    tempString = iStr[i];
    i++;
  }
  if (iStr[i] == iStr[i - 1]) {
    tempString = tempString + iStr[i];
    i++;
  }
}

splits.push(tempString);

function getNumberOfSpaces(zeroStringLength) {
  return Math.floor(zeroStringLength / 2);
}

function getCharIndex(numberStringLength, wordMapStringLength) {
  if (numberStringLength <= wordMapStringLength) {
    return numberStringLength - 1;
  } else {
    if (numberStringLength % wordMapStringLength != 0) {
      return (numberStringLength % wordMapStringLength) - 1;
    } else {
      return wordMapStringLength - 1;
    }
  }
}

let output = [];
let tempOutput = "";
for (const part of splits) {
  if (part.includes("0")) {
    tempOutput = " ".repeat(getNumberOfSpaces(part.length));
    output.push(tempOutput);
    tempOutput = "";
  } else {
    tempOutput =
      wordMap[part[0]][getCharIndex(part.length, wordMap[part[0]].length)];
    output.push(tempOutput);
    tempOutput = "";
  }
}

console.log(output.join(""));
