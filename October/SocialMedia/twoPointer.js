const { options } = require("./routes");

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

let inputStr = "00444444005555556666668888883333300034444449999999992222555444";
//   444444005555556666668888883333300334444449999999992222555444
//  44444400555555666666888888333330034444449999999992222555444

let output = "";
let iStr = inputStr.replace(/[1*#a-zA-Z]/g, "");

function getIndex(stL, strL) {
  if (stL <= strL) {
    return stL - 1;
  } else {
    if (stL % strL != 0) {
      return (stL % strL) - 1;
    } else {
      return strL - 1;
    }
  }
}

let i = 0;
let j = 1;
let current;
while (i < iStr.length || j < iStr.length) {
  if (iStr[i] == iStr[j]) {
    current = iStr[i];
    j++;
  } else {
    if (current == 0) {
      output += " ".repeat(Math.floor((j - i) / 2));

      i = j;
      current = iStr[i];
      j++;
    } else {
      output += wordMap[current][getIndex(j - i, wordMap[current].length)];

      i = j;
      current = iStr[i];
      j++;
    }
  }
}

console.log(output);
