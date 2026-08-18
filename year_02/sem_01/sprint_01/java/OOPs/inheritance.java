// Question: Create a parent class “Employee”, Name, Salary, Displayenployee()..........       Child class —> Manager, Department, displaymanager()


class Employee {
    String name;
    double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    void displayEmployee() {
        System.out.println("Name: " + name);
        System.out.println("Salary: " + salary);
    }
}

class Manager extends Employee {
    String department;

    Manager(String name, double salary, String department) {
        super(name, salary);
        this.department = department;
    }

    void displayManager() {
        displayEmployee();
        System.out.println("Department: " + department);
    }
}

public class inheritance {
    public static void main(String[] args) {

        Manager m = new Manager("Laxman", 55000, "CSE");

        m.displayManager();
    }
}