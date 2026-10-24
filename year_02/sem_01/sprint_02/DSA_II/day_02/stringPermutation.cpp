// same characters in same or different orders are called string permutations.
// (a,b,c,c) and (c,c,a,b) are two string permutations...

// Leet Code 567 - permutation in string


#include <iostream>
#include <string>

using namespace std;

int main() {
    char ch = 'a';
    
    cout << ch << endl;
    cout << (int)ch << endl;
    
    // Initializing the 256-size array with 0s
    int freq[256] = {0}; 
    
    freq[97]++;
    cout << freq[97] << endl;
    cout << freq[96] << endl;
    cout << freq[98] << endl;
    
    freq[ch]++;
    cout << freq[97] << endl;
    
    freq['a']++;
    cout << freq[97] << endl;
    
    string test_str = "aabcc";
    cout << test_str.at(0) << endl;
    
    string s = "school";
    for(int i = 0; i < s.length(); i++) {
        // Empty loop body
    }
    
    return 0;
}