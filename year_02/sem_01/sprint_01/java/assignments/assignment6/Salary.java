import java.util.Scanner;

public class Salary {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter Basic Salary: ₹");
        double basic = input.nextDouble();
        
        double hra = basic * 0.20;
        double da = basic * 0.10;
        double allowance;
        
        if (basic > 50000) {
            allowance = basic * 0.05;
        }
        else {
            allowance = basic * 0.02;
        }
        
        double gross = basic + hra + da + allowance;
        
        System.out.printf("HRA ₹%.0f; DA ₹%.0f; Allowance ₹%.0f; Gross ₹%.0f\n", 
                          hra, da, allowance, gross);
                          
        input.close();
    }
}
