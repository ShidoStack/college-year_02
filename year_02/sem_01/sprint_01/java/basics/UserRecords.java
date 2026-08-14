import java.util.Scanner;

class UserRecords{

    public static void main(String args[]){
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Phone No.: ");
        String phoneNo = sc.nextLine();
        
        System.out.print("Department:  ");
        String department = sc.nextLine();
        
        System.out.print("Division: ");
        char division = sc.next().charAt(0);
        
        System.out.print("Percentage: ");
        float percentage = sc.nextFloat();

        System.out.println("Your Name :-" + name);
        System.out.println("Your PhoneNo. :" +phoneNo);
        System.out.println("Your Department :" +department);
        System.out.println("Your division :" +division);
        System.out.println("Your percentage :" +percentage);

        }
    }
