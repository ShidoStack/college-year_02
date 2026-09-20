class Base{
    final void Hello(){
        System.out.println("hello");
    }
}

class Derived extends Base{
    void Hello(){
        System.out.println("hi");
    }
    //fxn overriding is not possible if the fxn is final

    //but fxn overloading is possible like this....
    // void Hello(int a){
    //     System.out.println("hi");
    // }
}

public class finalmethod {
    public static void main(String[] args) {
        Derived obj = new Derived();
        obj.Hello(2);
    }
}
