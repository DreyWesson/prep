function maxSubArray(nums) {
    let head = 0;
    let max = nums[0];
let sum = 0

    while (head < nums.length) {
        if (sum < 0)
            sum = 0;
        sum += nums[head];
        max = Math.max(sum, max);
        head++;
    }
    console.log(max);
};
maxSubArray([-2,1,-3,4,-1,2,1,-5,4])