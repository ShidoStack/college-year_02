class StaticDemo{
    int a;
    static int b = 10;

    void fun(){
        System.out.println(a);
        System.out.println(b);
    }
    //if my function is static it is only allowed to access static characteristics
    //if my function is non static it is allowed to access both

    public static void gun(){
        // System.out.println(a); //because a is non static
        System.out.println(b);
    }
}

public class Main {
    public static void main(String[] args) {
        StaticDemo obj = new StaticDemo();
        obj.fun();
        // obj.gun(); //you dont need to create an object to run static fxns
        StaticDemo.gun();
    }
}
