import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.println("Enter operation (+, -, *, /):");
        char operation = input.next().charAt(0);

        System.out.println("Enter first number:");
        int firstNumber = input.nextInt();

        System.out.println("Enter second number:");
        int secondNumber = input.nextInt();

        switch (operation) {

            case '+':
                System.out.println(firstNumber + secondNumber);
                break;

            case '-':
                System.out.println(firstNumber - secondNumber);
                break;

            case '*':
                System.out.println(firstNumber * secondNumber);
                break;

            case '/':
                System.out.println(firstNumber / secondNumber);
                break;

            default:
                System.out.println("Invalid operation");
        }
    }
}