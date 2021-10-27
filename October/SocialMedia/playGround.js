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

let iStr = "444444005555556666668888883333003444444999999992222555444";
let stack = [];
let output = [];

stack.push(iStr[0]);

i = 1;
while (i < iStr.length) {
  if (iStr[i] == iStr[i - 1]) {
    stack.push(iStr[i]);
    i++;
  } else if (iStr[i] != iStr[i - 1] && iStr[i] != 0) {
    console.log(
      wordMap[iStr[i - 1]][(stack.length % wordMap[iStr[i - 1]].length) - 1]
    );
    output.push(
      wordMap[iStr[i - 1]][(stack.length % wordMap[iStr[i - 1]].length) - 1]
    );
    stack.length = 0;
    stack.push(iStr[i]);
    i++;
  } else if (iStr[i] == 0 && iStr[i + 1] != 0) {
    output.push(
      wordMap[iStr[i - 1]][(stack.length % wordMap[iStr[i - 1]].length) - 1]
    );
    stack.length = 0;
    stack.push(iStr[i + 1]);
    i = i + 2;
  } else if (iStr[i] == 0 && iStr[i + 1] == 0) {
    output.push(
      wordMap[iStr[i - 1]][(stack.length % wordMap[iStr[i - 1]].length) - 1]
    );
    output.push(" ");
    stack.length = 0;
    stack.push(iStr[i + 2]);
    i = i + 3;
  }
}

// output.push(wordMap[iStr[0]][stack.length - 1]);
// // output.push(
// //   wordMap[iStr[i - 1]][wordMap[iStr[i - 1]].length % (stack.length - 1)]
// // );
output.push(
  wordMap[iStr[i - 1]][(stack.length % wordMap[iStr[i - 1]].length) - 1]
);

console.log(output.join(""));
