 class TypeCasting{

    public static void main(String arg[]){

        // manual typeConversion or shorteniung - when converting larger size dataTypes into smaller size dataTypes
        double num = 10.89;
        int a = (int) num;
        System.out.println(a);

        // automatic typeConversion or Widening - when converting smaller size dataTypes into larger size dataTypes
        char ch = 'a';
        int b = (int) ch;
        System.out.println(b);
        }
    }
