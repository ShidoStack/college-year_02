import java.util.Scanner;

public class ShapeArea {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        System.out.print("Enter Shape (Circle/Rectangle): ");
        String shapeType = input.next();
        
        if (shapeType.equalsIgnoreCase("Circle")) {
          
            System.out.print("Enter radius: ");
            double radius = input.nextDouble();
            
            Shape circle = new Circle(radius);
            System.out.printf("Area: %.2f sq.units\n", circle.calculateArea());
            
        }
        else if (shapeType.equalsIgnoreCase("Rectangle")) {
            
            System.out.print("Enter length: ");
            double length = input.nextDouble();
            
            System.out.print("Enter width: ");
            double width = input.nextDouble();
            
            Shape rectangle = new Rectangle(length, width);
            System.out.printf("Area: %.2f sq.units\n", rectangle.calculateArea());
            
        }
        else {
            System.out.println("Invalid shape.");
        }
        
        input.close();
    }
}

abstract class Shape {
    
    public abstract double calculateArea();
    
}

class Circle extends Shape {
    
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    
    private double length;
    private double width;
    
    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }
    
    @Override
    public double calculateArea() {
        return length * width;
    }
}
