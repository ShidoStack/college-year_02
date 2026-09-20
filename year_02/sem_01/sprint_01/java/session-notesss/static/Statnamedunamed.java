class Demo {
    int a, b;
    static int x, y;

    static{ 
        System.out.println("inside static block...");
        x = 10;
        y = 20;
    }
    {
        System.out.println("inside unnamed block...");
        a = 50;
        b = 60;
    }
    Demo(){
        System.out.println("inside constructor...");
    }

    void fun() {
        System.out.println("inside fun...");
    }
}

//


public class Statnamedunamed {
    public static void main(String[] args) {
        System.out.println("inside main...");
        Demo obj = new Demo();
        obj.fun();
    }
}
