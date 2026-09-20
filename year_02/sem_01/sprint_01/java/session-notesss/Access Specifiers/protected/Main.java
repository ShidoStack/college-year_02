class Protect{
    protected int a = 10;
    protected int b=20;
    void display(){
        System.out.println(a);
    }
}
//protected is accessible to any class that extends that class

class Child extends Protect{
    void childDisplay(){
    System.out.println(a);
    System.out.println(b);
    }
}

class Main{
    public static void main(String[] args) {
        Protect obj = new Protect();

        
        // Child obj = new Child();
        System.out.println(obj.a);
        System.out.println(obj.b);
        // // obj.display();
        // obj.childDisplay();
    }
}