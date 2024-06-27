function twoSum(arr, target) {
  const map = new Map();
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    const diff = target - arr[i];
    map.has(diff) ? res.push([map.get(diff), i]) : map.set(arr[i], i);
  }
  return res;
}
console.log(twoSum([11, -2, 15, 2, 2, 5, 8, 2, 7, 6, 3], 9));
