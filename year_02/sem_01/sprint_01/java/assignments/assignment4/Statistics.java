import java.util.Scanner;

public class Statistics {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter number of integers (N): ");
        int n = input.nextInt();
        
        if (n <= 0) {
            System.out.println("Invalid input. N must be positive.");
            input.close();
            return;
        }
        
        System.out.print("Enter " + n + " numbers: ");
        
        int sum = 0;
        int largest = Integer.MIN_VALUE;
        int smallest = Integer.MAX_VALUE;
        
        int evenCount = 0;
        int oddCount = 0;
        
        for (int i = 0; i < n; i++) {
            
            int num = input.nextInt();
            sum += num;
            
            if (num > largest) {
                largest = num;
            }
            
            if (num < smallest) {
                smallest = num;
            }
            
            if (num % 2 == 0) {
                evenCount++;
            }
            else {
                oddCount++;
            }
        }
        
        double average = (double) sum / n;
        
        System.out.printf("Sum %d; Average %.2f; Largest %d; Smallest %d; Even %d; Odd %d\n", 
                          sum, average, largest, smallest, evenCount, oddCount);
                          
        input.close();
    }
}
