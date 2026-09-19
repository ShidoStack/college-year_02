import java.util.Scanner;

public class Recharge {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.println("Available Plans:");
        System.out.println("1. ₹199 (1.5 GB/day, 28 days)");
        System.out.println("2. ₹299 (2 GB/day, 28 days)");
        System.out.println("3. ₹499 (3 GB/day, 56 days)");
        
        System.out.print("Enter your choice: ");
        int choice = input.nextInt();
        
        switch (choice) {
            case 1:
                System.out.println("Plan ₹199; Data 1.5 GB/day; Validity 28 days");
                break;
                
            case 2:
                System.out.println("Plan ₹299; Data 2 GB/day; Validity 28 days");
                break;
                
            case 3:
                System.out.println("Plan ₹499; Data 3 GB/day; Validity 56 days");
                break;
                
            default:
                System.out.println("Invalid choice.");
        }
        
        input.close();
    }
}
