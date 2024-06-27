// Given a number N return the index value of the Fibonacci sequence,
// where the sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144 ...
// the pattern of the sequence is that each value is the sum of the 2
// previous values, that means that for N=5 → 2+3
//For example: fibonacciRecursive(6) should return 8


function fibonacciRecursive(n, memo = []) {
  console.log(n);
  if (memo[n] !== undefined) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fibonacciRecursive(n - 1, memo) + fibonacciRecursive(n - 2, memo);
  return memo[n];
}
console.log(fibonacciRecursive(5));

function fibonacciIterativeB(n) {
  let prevNum = 0, currentNum = 1;

  for (let i = 2; i <= n; i++) {
    let nextNum = prevNum + currentNum;
    prevNum = currentNum;
    currentNum = nextNum;
  }

  return currentNum;
}
console.log(fibonacciIterativeB(1000));