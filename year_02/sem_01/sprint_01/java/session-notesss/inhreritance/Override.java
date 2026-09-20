class Base{
    void fun(){
        System.out.println("Inside fun");
    }
    void gun(){
        System.out.println("inside gun");
    }
}

class Derived extends Base{
    void fun(){
        System.out.println("inside derived fun");
    }
    // void gun(){
    //     System.out.println("inside derived gun");
    // }
}

public class Override {
    public static void main (String args[]){
        
        //fxns overloading //making decisions at compile time
        Base obj1 = new Base();
        obj1.fun();

        Derived obj2 = new Derived();
        obj2.fun();

        //fxns overriding
        Base obj3 = new Derived();
        obj3.fun(); //upcasting
        // obj3.Base.fun();
        obj3.gun(); //upcasting //making decisions at runtime

        // Derived obj4 = new Base();
        // obj4.fun(); 
    }
}
