class Information{
    String name;
    int age;
    Information(String name, int age){
        // name = name;
        // age = age; //null0 error
        //hence use this keyword
        this.name = name;
        this.age = age;
        }
        void display(){
            System.out.println(name + age);
    }
}
public class Withcons {
    public static void main (String args[]){
        Information obj1 = new Information("ali", 2);
        obj1.display();
    }
}
