import java.util.Scanner;

public class Result {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter marks for 5 subjects (separated by spaces): ");
        int m1 = input.nextInt();
        int m2 = input.nextInt();
        int m3 = input.nextInt();
        int m4 = input.nextInt();
        int m5 = input.nextInt();
        
        int total = m1 + m2 + m3 + m4 + m5;
        double percentage = (double) total / 5.0;
        
        String grade = "";
        boolean isPass = (m1 >= 40 && m2 >= 40 && m3 >= 40 && m4 >= 40 && m5 >= 40);
        
        if (isPass) {
            if (percentage >= 80) {
                grade = "A";
            }
            else if (percentage >= 60) {
                grade = "B";
            }
            else if (percentage >= 50) {
                grade = "C";
            }
            else if (percentage >= 40) {
                grade = "D";
            }
            else {
                grade = "F";
            }
        }
        else {
            grade = "F";
        }
        
        System.out.printf("Total %d/500; Percentage %.2f%%; %s; Grade %s\n", 
                          total, percentage, (isPass ? "PASS" : "FAIL"), grade);
                          
        input.close();
    }
}
