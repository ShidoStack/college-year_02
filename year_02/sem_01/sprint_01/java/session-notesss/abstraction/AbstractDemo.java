abstract class Animal{
    abstract void sound();
    void steps(){
        System.out.println("inside steps");
    }
}


class Dog extends Animal{
    void sound(){
        System.out.println("inside sound");
    }
}

class AbstractDemo{
    public static void main(String[] args) {
        Dog obj = new Dog();
        obj.sound();
    }
}