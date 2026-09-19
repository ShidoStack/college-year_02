import java.util.Scanner;

public class EmployeeInheritance {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter Role (Manager/Developer): ");
        String role = input.next();
        
        System.out.print("Enter Name: ");
        String name = input.next();
        
        System.out.print("Enter Salary: ₹");
        double salary = input.nextDouble();
        
        if (role.equalsIgnoreCase("Manager")) {
            Manager m = new Manager(name, salary);
            m.displayCompensation();
        }
        else if (role.equalsIgnoreCase("Developer")) {
            Developer d = new Developer(name, salary);
            d.displayCompensation();
        }
        else {
            System.out.println("Invalid role.");
        }
        
        input.close();
    }
}

class Employee {
    
    protected String name;
    protected double salary;
    
    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }
}

class Manager extends Employee {
    
    public Manager(String name, double salary) {
        super(name, salary);
    }
    
    public void displayCompensation() {
        
        double bonus = salary * 0.20;
        double total = salary + bonus;
        
        System.out.printf("Bonus ₹%.0f; Total Compensation ₹%.0f\n", bonus, total);
    }
}

class Developer extends Employee {
    
    public Developer(String name, double salary) {
        super(name, salary);
    }
    
    public void displayCompensation() {
        
        double bonus = salary * 0.10;
        double total = salary + bonus;
        
        System.out.printf("Bonus ₹%.0f; Total Compensation ₹%.0f\n", bonus, total);
    }
}
