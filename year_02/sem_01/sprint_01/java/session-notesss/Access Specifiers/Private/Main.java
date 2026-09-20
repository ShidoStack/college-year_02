class PrivDemo{
    private int a = 10;
    void display(){
        System.out.println(a);
    }
}
//private is not accessible outside class

public class Main {
    public static void main(String[] args) {
        PrivDemo obj = new PrivDemo();
        System.out.println(obj.a);
        obj.display();
    }
}
