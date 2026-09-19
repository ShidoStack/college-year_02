import java.util.Scanner;

public class StudentEncap {
    public static void main(String[] args) {
        
        Scanner input = new Scanner(System.in);
        
        Student student = new Student();
        
        System.out.print("Enter Roll No: ");
        student.setRollNo(input.nextInt());
        
        System.out.print("Enter Name: ");
        student.setName(input.next());
        
        System.out.print("Enter Course: ");
        student.setCourse(input.next());
        
        System.out.print("Enter Marks: ");
        student.setMarks(input.nextInt());
        
        System.out.printf("Roll No %d; Name %s; Course %s; Marks %d\n",
                          student.getRollNo(), student.getName(), 
                          student.getCourse(), student.getMarks());
                          
        input.close();
    }
}

class Student {
    
    private int rollNo;
    private String name;
    private String course;
    private int marks;
    
    public int getRollNo() {
        return rollNo;
    }
    
    public void setRollNo(int rollNo) {
        this.rollNo = rollNo;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCourse() {
        return course;
    }
    
    public void setCourse(String course) {
        this.course = course;
    }
    
    public int getMarks() {
        return marks;
    }
    
    public void setMarks(int marks) {
        if (marks >= 0 && marks <= 100) {
            this.marks = marks;
        }
        else {
            System.out.println("Invalid marks. Must be between 0 and 100.");
            this.marks = 0;
        }
    }
}
