import java.util.Scanner;

public class HospitalStaff {

    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter Role (Doctor/Nurse): ");
        String role = input.nextLine();

        System.out.print("Enter Name: ");
        String name = input.nextLine();

        System.out.print("Enter ID: ");
        String id = input.nextLine();

        System.out.print("Enter Specialization/Ward: ");
        String extra = input.nextLine();

        Staff staffMember;

        if (role.equalsIgnoreCase("Doctor")) {
            staffMember = new Doctor(name, id, extra);
        }
        else if (role.equalsIgnoreCase("Nurse")) {
            staffMember = new Nurse(name, id, extra);
        }
        else {
            System.out.println("Invalid role.");
            input.close();
            return;
        }

        staffMember.displayRole();

        input.close();
    }
}

class Staff {

    protected String name;
    protected String id;

    public Staff(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public void displayRole() {
        System.out.println("Role: General Staff");
    }
}

class Doctor extends Staff {

    private String specialization;

    public Doctor(String name, String id, String specialization) {
        super(name, id);
        this.specialization = specialization;
    }

    @Override
    public void displayRole() {
        System.out.println("Name: " + name);
        System.out.println("ID: " + id);
        System.out.println("Role: Doctor");
        System.out.println("Specialization: " + specialization);
    }
}

class Nurse extends Staff {

    private String ward;

    public Nurse(String name, String id, String ward) {
        super(name, id);
        this.ward = ward;
    }

    @Override
    public void displayRole() {
        System.out.println("Name: " + name);
        System.out.println("ID: " + id);
        System.out.println("Role: Nurse");
        System.out.println("Ward: " + ward);
    }
}