import java.util.Scanner;

class Info
{
    public static void main(String[] args) {

        Scanner name_sc = new Scanner(System.in);
        System.out.println("Enter your name:");

        String name = name_sc.nextLine();

        Scanner age_sc = new Scanner(System.in);
        System.out.println("Enter your age:");

        int age = age_sc.nextInt();

        Scanner phone_sc = new Scanner(System.in);
        System.out.println("Enter your phone number:");

        long phone = phone_sc.nextInt();

        Scanner department_sc = new Scanner(System.in);
        System.out.println("Enter your department:");

        char department = department_sc.next().charAt(0); //example department : a/b/c/d

        System.out.println("Hello, " + name + " Age: " + age + " Phone_no: " + phone + " From Department: " + department);

    }

}

