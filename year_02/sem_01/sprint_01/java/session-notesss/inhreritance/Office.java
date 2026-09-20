class Employee{
    String name;
    double salary;

    void displayEmployee(){
        System.out.println("Hello my name is "+name+" and my salary is "+ salary+" Rs");
    }
}

class Manager extends Employee{

    String department;
    void displayManager(){
        System.out.println("Hello my name is "+name+" , i am a Manager and my salary is "+ salary+" Rs, my department is " + department );
    }
}



public class Office{
    public static void main(String args[]){
    Employee e1 = new Employee();
    e1.name = "Ali";
    e1.salary = 25555;
    e1.displayEmployee();

    Manager m1 = new Manager();
    m1.name = "ali";
    m1.salary = 100000;
    m1.department = "Tech";
    m1.displayManager();
    }
    
}