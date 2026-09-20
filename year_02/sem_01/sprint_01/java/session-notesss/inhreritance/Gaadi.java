class Vehicle{
    String brand;
    char model;

    void displayVehicle(){
        System.out.println("Brand: " + brand +  " Model: " + model );
    }
}

class Car extends Vehicle{

    int no_door;
    boolean ac;

    void displayVehicle(){
        System.out.println("Brand: " + brand + " Model: " + model + " Number of doors: " + no_door + " hasAC: " + ac);
    }
}

class Bike extends Vehicle{
    
    int helmet;

    void displayVehicle(){
        System.out.println("Brand: " + brand + " Model: " + model + " Number of helmets: " + helmet);
    }
}



public class Gaadi{
    public static void main(String args[]){

        Vehicle v1 = new Vehicle();
        v1.brand = "Tesla";
        v1.model = 'y';
        v1.displayVehicle();

        System.out.println("Car Details: ");

        Car c1 = new Car();

        c1.brand = "Tesla";
        c1.model = 'y';
        c1.no_door = 4;
        c1.ac = true;
        c1.displayVehicle();

        System.out.println("Bike Details: ");

        Bike b1 = new Bike();
        b1.brand = "Tesla";
        b1.model = 'y';
        b1.helmet = 1;
        b1.displayVehicle();

        Vehicle v2 = new Car(); //upcasting
        Vehicle v3 = new Bike(); //upcasting

        v2.displayVehicle();
        v3.displayVehicle();

    }
}