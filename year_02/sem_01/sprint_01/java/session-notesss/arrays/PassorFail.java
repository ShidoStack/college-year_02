import java.util.Scanner;

public class PassorFail {
    public static void main(String[] args) {
    
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter total number of students ");
        int n = sc.nextInt();

        int arr[]= new int[n];

    for(int i = 0; i < n; i++){
        
        System.out.println("Enter total marks for " + (i+1) + " student(out of 100): ");
        arr[i]= sc.nextInt();  
    }

    int passing = 40;

    for(int i = 0; i < arr.length; i++){
        if(arr[i]>=passing){
            System.out.println(i+1 + " student passed");
        }else{
            System.out.println(i+1 +" student failed");
        }
    }
}
}
