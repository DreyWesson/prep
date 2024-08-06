#include <unordered_set>
#include <iostream>
#include <vector>
#include <map>

using namespace std;

class Solution
{
public:
  int maxSubArray(vector<int> &nums)
  {
    vector<int>::iterator i = nums.begin();
    vector<int>::iterator j = nums.begin();
    j++;
    int max = 0;

    while (i != nums.end())
    {
      while (j != nums.end())
      {
        *j + *i;
        j++;
      }
      i++;
    }
    return (0);
  }
};

int main(void)
{
  vector<int> vec = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
  Solution x;
  x.maxSubArray(vec);
  return (0);
}