class Parent{
    String name;
    int age;

    void Introp(){
        System.out.println("Hello my name is "+name+" and i am "+ age+" years old");
    }
}

class Child extends Parent{
    String toy;
    void Introc(){
        System.out.println("Hello my name is "+name+" , i am "+ age+" years old and my fav toy is " + toy);
    }
}



public class Inheritance {
    public static void main(String args[]){
    Parent p1 = new Parent();
    // p1.Int(); //cant find symbol error
    Child c1 = new Child();
    c1.name = "ali";
    c1.age = 10;
    c1.toy = "Pokemons";
    c1.Introc();
    c1.Introp();
    }
    
}
