class Animal {
  void sound() {
    System.out.println("Animal sound");

  }
}

class Dog extends Animal {
  void sound() {
    System.out.println("Meow!!!");
  }

  void show() {
    super.sound();

  }
}

public class Super {
  public static void main(String[] args) {
    Dog obj = new Dog();
    obj.show();
  }
}