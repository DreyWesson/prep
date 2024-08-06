#include <stdio.h>
double findMaxAverage(int* nums, int numsSize, int k) {
    int i = 0;
    double maxAvg = 0.00;
    double sum = 0.00;
    while (i < k)
    {
        sum += nums[i];
        i++;
    }
    maxAvg = sum / k;

    int tail = 0;
    while (i < numsSize) {
        sum -= nums[tail];
        sum += nums[i];
        if ((sum / k) > maxAvg) {
            maxAvg = sum / (double)k;
        }
        tail++;
        i++;
    }
    return maxAvg;
}

int main() {
    int nums[] = {1,12,-5,-6,50,3};
    findMaxAverage(nums, 6, 4);
    return (0);
}