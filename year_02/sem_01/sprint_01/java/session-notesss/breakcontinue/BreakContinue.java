public class BreakContinue {
    public static void main(String[] args) {
        for(int i = 0; i<=10; i++){
            if(i==5){
                //break; break terminates the loop
                continue; //continue will skip number 5
            }
            System.out.println(i);
        }
    }
}
