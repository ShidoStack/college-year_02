public class Prac {
    public static void main(String args[]){
        Add a = new  Add();
        a.c = 80;
        a.d = 23;
        System.out.println(a.addition());
    }
}

class Add{
    int c = 15;
    int d = 25;

    public int addition(){
        return c + d;
    }
}
