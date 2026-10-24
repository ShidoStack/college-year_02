#include <iostream>
using namespace std;

int main()
{
    int height[] = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    int n = sizeof(height)/sizeof(height[0]);

    int left_max[n]; 
    int right_max[n];
    int total_water = 0;


    left_max[0] = height[0];
    for(int i = 1; i <n; i++)
    {
        left_max[i] = max(left_max[i-1], height[i]);
    }


    right_max[n - 1] = height[n - 1];
    for(int i = n-2; i>=0; i--)
    {
        right_max[i] = max(right_max[i+1], height[i]);
    }

    
    int water[n];
    for (int i = 0; i < n; i++) {
    
        water[i] = min(left_max[i], right_max[i]) - height[i];
        total_water += water[i];
        
        
    //     cout << i << "\t" << height[i] << "\t" << water[i] << " units" << endl;
    }

    cout << "Total water : " << total_water << " units" << endl;
    return 0;
}