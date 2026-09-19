import java.util.Scanner;

public class VehicleOverriding {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter Vehicle Type (Car/Bike): ");
        String type = input.next();
        
        Vehicle vehicle = null;
        
        if (type.equalsIgnoreCase("Car")) {
            vehicle = new Car();
        }
        else if (type.equalsIgnoreCase("Bike")) {
            vehicle = new Bike();
        }
        else {
            System.out.println("Invalid vehicle type.");
            input.close();
            return;
        }
        
        vehicle.start();
        
        input.close();
    }
}

class Vehicle {
    
    public void start() {
        System.out.println("Vehicle is starting.");
    }
}

class Car extends Vehicle {
    
    @Override
    public void start() {
        System.out.println("Car starts with push-button ignition.");
    }
}

class Bike extends Vehicle {
    
    @Override
    public void start() {
        System.out.println("Bike starts with self-start.");
    }
}
