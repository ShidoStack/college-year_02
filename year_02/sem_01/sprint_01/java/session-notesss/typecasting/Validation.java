import java.util.Scanner;

public class Validation {
    
    public static void main(String[] var0) {

    Scanner var1 = new Scanner(System.in);
    System.out.println("Enter your name:");

    String var2 = var1.nextLine();
    if(var1.hasNextInt()){
        
    }

    Scanner var3 = new Scanner(System.in);
    System.out.println("Enter your age:");

    int var4 = var3.nextInt();

    Scanner var5 = new Scanner(System.in);
    System.out.println("Enter your phone number:");

    long var6 = (long)var5.nextInt();

    Scanner var8 = new Scanner(System.in);
    System.out.println("Enter your department:");

    char var9 = var8.next().charAt(0);

    System.out.println("Hello, " + var2 + " Age: " + var4 + " Phone_no: " + var6 + " From Department: " + var9);
}

}
