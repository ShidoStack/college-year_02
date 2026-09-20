class Demo{
    Demo(){
        System.out.println("Inside Default Constructor:----- ");
    }
    
    public void addition(int x, int y){
        int sum = x + y;
        System.out.println("Overloading: x + y: " + sum);
    }
    public void addition(int x, int y, int z){
        int sum = x + y;
        System.out.println("Overloading: x + y: " + sum);
    }
    public void addition(int x, float y){
        float sum = x + y;
        System.out.println("Overloading: x + y: " + sum);
    }
    public void addition(float x, int y){
        float sum = x + y;
        System.out.println("Overloading: x + y: " + sum);
    }
    public void addition(float x, float y, float z){
        float sum = x + y + z;
        System.out.println("Overloading: int x + float y: " + sum);
    }
    public void addition(double x, double y, double z){
        double sum = x + y + z;
        System.out.println("Overloading: int x + float y: " + sum);
    }
}


public class Overloading {
    public static void main(String arg[]){
        System.out.println("Overlaoding: ");
        Demo obj1 = new Demo();
        obj1.addition(10.12f, 20.22f, 23.23f);
        obj1.addition(10, 20);
        obj1.addition(30.1, 23.2, 33.2);
    }
}
