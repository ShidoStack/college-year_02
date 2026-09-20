class DefaultDemo{
    int a = 10;
    void display(){
        System.out.println(a);
    }
}//default is accessible throughout the package ie this file, and not outside it
//while public is accessible even outside the package

public class Main {
    public static void main(String[] args) {
        DefaultDemo obj = new DefaultDemo();
        System.out.println(obj.a);
        obj.display();
    }
}
