public class ArrayDemo {
    public static void main(String[] args) {
        int[] arr = {10,20,30,40,50}; //direct initialisation
        System.out.println(arr);
        System.out.println(arr[0]);

        int[] arr2 = new int [5]; //new is used for dynamic memory allocation, 
        // if you want to just reserve memory for your array, use this syntax

        // later if you want to define it....
        arr2[0]=10;
        arr2[1]=20;
        System.out.println(arr2);
        System.out.println(arr2[1]);

        //2d arrays
        //a 3x3 array (matrix)
        int arr3[][]={{10,20,30},
                    {40,50,60},
                    {70,80,90}};

        System.out.println(arr3[0][1]); //1st bracket represents row and 2nd bracket represents 
        // column for accessing by using index

        //loop for printing the whole array
        System.out.println(arr3.length);
        for(int i=0; i<arr3.length; i++){
            for(int j=0; j<arr3.length; j++){
                System.out.println(arr3[i][j]);
            }
        }
        System.out.println(arr3);
        System.out.println(arr3[0]);
    }
}
