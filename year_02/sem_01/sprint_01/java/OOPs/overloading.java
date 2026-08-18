class Demo {
    Demo() {
        System.out.println("Inside Default Constructor");
    }

    public void addition() {
        System.out.println("Addition with no parameters");
    }

    public void addition(int x, int y) {
        System.out.println("Overloading X,Y !! Sum = " + (x + y));
    }
}

class Overloading {
    public static void main(String arg[]) {
        System.out.println("Overloading !!");
        Demo obj = new Demo();
        
        obj.addition();
        obj.addition();
    }
}