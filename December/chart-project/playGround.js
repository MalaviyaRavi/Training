let today = new Date();
let xAxis = [];

for (let i = 0; i < 7; i++) {
  let newDate = new Date(today.setFullYear(today.getFullYear() - 1));
  xAxis.push(String(newDate.getFullYear() + 1));
}

console.log(xAxis);
