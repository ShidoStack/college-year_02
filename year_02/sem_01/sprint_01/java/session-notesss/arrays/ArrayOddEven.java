import java.util.Scanner;


public class ArrayOddEven {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter total number of elements: ");
        int n = sc.nextInt();

        int arr[]= new int[n];

    for(int i = 0; i < n; i++){
        
        System.out.println("Enter your " + (i+1) + " element: ");
        arr[i]= sc.nextInt();  
    }
    int evencount = 0;
    int oddcount = 0;
    for(int i = 0; i < arr.length; i++){
        if(arr[i]%2==0){
            evencount++;
            System.out.println(arr[i] + " is even");
        }else{
            oddcount++;
            System.out.println(arr[i]+ " is odd");
        }
    }

    System.out.println("total number of even "+ evencount);
    System.out.println("total number of odd "+ oddcount);
    
    }
}
