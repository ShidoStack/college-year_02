public class Percentage {
    public static void main(String arg[]){
        float total_marks = 500;
        float s1 = 90;
        float s2 = 88;
        float s3 = 95;
        float s4 = 92;
        float s5 = 91;

        float marks_obtained = s1 + s2 + s3 + s4 + s5;

        float percentage = (marks_obtained/total_marks)*100;

        System.out.println(percentage + "%");
    }
}
