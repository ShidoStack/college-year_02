class Bill{
    public int billing(int item){
        System.out.println("price of one item : " + item);
        return item;
        
    }
    public int billing(int item, int q){
        int sum= item*q;
        System.out.println("price of multiple item : " + sum);
        return sum;
        
    }
    public float billing(int item, int q, float tax){
        float sum = item*q;
        float total_tax= sum * tax;
        float totalbill = sum+total_tax;

        System.out.println("final bill with tax : " + totalbill);
        return totalbill;
        
    }
}

public class Superbill {
    public static void main(String arg[]){
        Bill obj1 = new Bill();
        obj1.billing(500);
        obj1.billing(500,2);
        obj1.billing(500, 2, 0.18f);
    }
}
