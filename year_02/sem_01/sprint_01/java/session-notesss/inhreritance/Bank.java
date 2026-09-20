class BankAccount {

    String name;
    int accountNumber;

    BankAccount(String name, int accountNumber) {
        this.name = name;
        this.accountNumber = accountNumber;
    }

    void display() {
        System.out.println("Name: " + name);
        System.out.println("Account Number: " + accountNumber);
    }
}

class SavingsAccount extends BankAccount {

    SavingsAccount(String name, int accountNumber) {
        super(name, accountNumber);
    }

    void savings() {
        System.out.println("This is a Savings Account");
    }
}

class CurrentAccount extends BankAccount {

    CurrentAccount(String name, int accountNumber) {
        super(name, accountNumber);
    }

    void current() {
        System.out.println("This is a Current Account");
    }
}


public class Bank {

    public static void main(String[] args) {

        SavingsAccount user1 = new SavingsAccount("Abdeali", 101);

        CurrentAccount user2 = new CurrentAccount("Arjun", 102);

        user1.display();
        user1.savings();

        System.out.println();

        user2.display();
        user2.current();
    }
}