class MathematicalOperations{
    float no1;
    float no2;
    MathematicalOperations(){
        System.out.println("Inside Default Constructer ");
        this.no1 = 10;
        this.no2 = 20;
    }

    MathematicalOperations(float x, float y){
        System.out.println("Inside Parameterized Constructer ");
        this.no1 = x;
        this.no2 = y;
    }
    public float Addition(){
        return this.no1 + this.no2;
    }
    public float Subtraction(){
        return this.no1 - this.no2;
    }

    public float Multiplication(){
        return this.no1 * this.no2;
    }

    public float Division(){
        return this.no2 / this.no1;
    }
}

class Arithmetic {
    public static void main(String arg[]){
        System.out.println("Inside Main Funtion");
        MathematicalOperations obj1 = new MathematicalOperations();
        MathematicalOperations obj2 = new MathematicalOperations(40, 50);
        float ret1 = obj1.Addition();
        float ret2 = obj2.Addition();
        System.out.println("Addition from obj1: "+ ret1);
        System.out.println("Addition from obj2: "+ ret2);

        float ret3 = obj1.Subtraction();
        float ret4 = obj2.Subtraction();
        System.out.println("Subtraction from obj1: "+ ret3);
        System.out.println("Subtraction from obj2: "+ ret4);

        float ret5 = obj1.Multiplication();
        float ret6 = obj2.Multiplication();
        System.out.println("Multiplication from obj1: "+ ret5);
        System.out.println("Multiplication from obj2: "+ ret6);

        float ret7 = obj1.Division();
        float ret8 = obj2.Division();
        System.out.println("Division from obj1: "+ ret7);
        System.out.println("Division from obj2: "+ ret8);
    }
}

