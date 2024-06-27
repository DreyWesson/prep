function prodOfArr(arr) {
  // can also use pop() method
  const len = arr.length;
  const helper = (arr, len) => {
    if (len-- < 0) return 1;
    return arr[len] * (len === 0 ? 1 : helper(arr, len));
  }
  return helper(arr, len);
}
console.log(prodOfArr([1, 2, 3])); // 6