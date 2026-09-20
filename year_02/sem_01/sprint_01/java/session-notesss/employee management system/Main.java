class Employee{
    String name;
    int id;
    double salary;
    Employee(String name, int id, double salary){
        this.name = name;
        this.id = id;
        this.salary = salary;
        Intro();
    }
    void Intro(){
        System.out.println("Hello my name is " + name + " ID: " + id + " Salary: " + salary + "Rs");
    }
    
}

interface Workable {
    void work_method();
}

class Developer extends Employee implements Workable{
     String prog_lang;
    Developer(String name, int id, double salary, String prog_lang){
        super( name, id, salary);
        this.prog_lang = prog_lang;
    }
    
    public void work_method(){
        System.out.println("Work method: Remote");
    }
    void writecode(){
        System.out.println("I code in: " + prog_lang);
    }
}

public class Main {
    public static void main(String[] args) {
        Developer obj = new Developer("Ali", 1, 25000.00, "Java" );
        obj.work_method();
        obj.writecode();
    }
}
