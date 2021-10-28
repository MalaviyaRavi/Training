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

let inputStr = "4444440055555566666688118888333330034444449999999992222555444";
//   444444005555556666668888883333300334444449999999992222555444
//  44444400555555666666888888333330034444449999999992222555444
let stack = [];
let output = [];
let iStr = inputStr.replace(/[1*#a-zA-Z]/g, "");
stack.push(iStr[0]);

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

i = 1;
while (i < iStr.length) {
  if (iStr[i] == iStr[i - 1]) {
    stack.push(iStr[i]);
    i++;
  } else if (iStr[i] != iStr[i - 1]) {
    if (stack.includes("0")) {
      output.push(" ".repeat(Math.floor(stack.length / 2)));
      stack.length = 0;
      stack.push(iStr[i]);
      i++;
    } else {
      output.push(
        wordMap[iStr[i - 1]][
          getIndex(stack.length, wordMap[iStr[i - 1]].length)
        ]
      );
      stack.length = 0;
      stack.push(iStr[i]);
      i++;
    }
  }
}

output.push(
  wordMap[iStr[i - 1]][getIndex(stack.length, wordMap[iStr[i - 1]].length)]
);

console.log(output.join(""));
