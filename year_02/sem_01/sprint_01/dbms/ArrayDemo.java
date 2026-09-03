import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;

public class ArrayDemo {

public static void main(String[] args) {

// =========================================================
// 1. CREATE ARRAYLIST
// =========================================================

System.out.println("----- 1. CREATE ARRAYLIST -----");

ArrayList<String> names = new ArrayList<>();

System.out.println("ArrayList created");


// =========================================================
// 2. ADD ELEMENTS
// =========================================================

System.out.println("\n----- 2. ADD ELEMENTS -----");

names.add("Rahul");
names.add("Priya");
names.add("Amit");
names.add("Sneha");

System.out.println(names);


// =========================================================
// 3. ADD ELEMENT AT SPECIFIC INDEX
// =========================================================

System.out.println("\n----- 3. ADD AT SPECIFIC INDEX -----");

names.add(1, "Rohit");

System.out.println(names);


// =========================================================
// 4. ADD ANOTHER COLLECTION
// =========================================================

System.out.println("\n----- 4. ADD ANOTHER COLLECTION -----");

ArrayList<String> newNames =
new ArrayList<>(Arrays.asList("Neha", "Karan"));

names.addAll(newNames);

System.out.println(names);


// =========================================================
// 5. GET ELEMENT
// =========================================================

System.out.println("\n----- 5. GET ELEMENT -----");

String name = names.get(2);

System.out.println("Element at index 2: " + name);


// =========================================================
// 6. UPDATE ELEMENT USING set()
// =========================================================

System.out.println("\n----- 6. UPDATE ELEMENT -----");

names.set(2, "Akshay");

System.out.println(names);


// =========================================================
// 7. REMOVE ELEMENT USING INDEX
// =========================================================

System.out.println("\n----- 7. REMOVE USING INDEX -----");

names.remove(1);

System.out.println(names);


// =========================================================
// 8. REMOVE ELEMENT USING VALUE
// =========================================================

System.out.println("\n----- 8. REMOVE USING VALUE -----");

names.remove("Sneha");

System.out.println(names);


// =========================================================
// 9. CHECK ELEMENT USING contains()
// =========================================================

System.out.println("\n----- 9. CONTAINS -----");

System.out.println(
"Contains Rahul? " + names.contains("Rahul")
);

System.out.println(
"Contains Amit? " + names.contains("Amit")
);


// =========================================================
// 10. FIND SIZE
// =========================================================

System.out.println("\n----- 10. SIZE -----");

System.out.println("Total elements: " + names.size());


// =========================================================
// 11. CHECK EMPTY
// =========================================================

System.out.println("\n----- 11. ISEMPTY -----");

System.out.println(
"Is ArrayList empty? " + names.isEmpty()
);


// =========================================================
// 12. ITERATE USING NORMAL FOR LOOP
// =========================================================

System.out.println("\n----- 12. FOR LOOP -----");

for (int i = 0; i < names.size(); i++) {

System.out.println(names.get(i));

}


// =========================================================
// 13. ITERATE USING FOR-EACH LOOP
// =========================================================

System.out.println("\n----- 13. FOR-EACH LOOP -----");

for (String studentName : names) {

System.out.println(studentName);

}


// =========================================================
// 14. ITERATE USING ITERATOR
// =========================================================

System.out.println("\n----- 14. ITERATOR -----");

Iterator<String> iterator = names.iterator();

while (iterator.hasNext()) {

System.out.println(iterator.next());

}


// =========================================================
// 15. FIND INDEX OF ELEMENT
// =========================================================

System.out.println("\n----- 15. INDEX OF -----");

System.out.println(
"Index of Rahul: " + names.indexOf("Rahul")
);


// =========================================================
// 16. LAST INDEX OF ELEMENT
// =========================================================

System.out.println("\n----- 16. LAST INDEX OF -----");

names.add("Rahul");

System.out.println(
"Last index of Rahul: " +
names.lastIndexOf("Rahul")
);


// =========================================================
// 17. SORT ARRAYLIST
// =========================================================

System.out.println("\n----- 17. SORT -----");

Collections.sort(names);

System.out.println(names);


// =========================================================
// 18. REVERSE ARRAYLIST
// =========================================================

System.out.println("\n----- 18. REVERSE -----");

Collections.reverse(names);

System.out.println(names);


// =========================================================
// 19. COPY ARRAYLIST
// =========================================================

System.out.println("\n----- 19. COPY ARRAYLIST -----");

ArrayList<String> copiedNames =
new ArrayList<>(names);

System.out.println("Copied ArrayList: " + copiedNames);


// =========================================================
// 20. CLEAR ARRAYLIST
// =========================================================

System.out.println("\n----- 20. CLEAR -----");

ArrayList<String> temp =
new ArrayList<>(names);

temp.clear();

System.out.println("After clear: " + temp);

System.out.println(
"Is empty? " + temp.isEmpty()
);


// =========================================================
// 21. ARRAYLIST WITH INTEGER
// =========================================================

System.out.println("\n----- 21. ARRAYLIST WITH INTEGER -----");

ArrayList<Integer> numbers = new ArrayList<>();

numbers.add(10);
numbers.add(20);
numbers.add(30);
numbers.add(40);

System.out.println(numbers);

System.out.println(
"Number at index 2: " + numbers.get(2)
);


// =========================================================
// 22. SORT INTEGER ARRAYLIST
// =========================================================

System.out.println("\n----- 22. SORT INTEGER ARRAYLIST -----");

numbers.add(5);

Collections.sort(numbers);

System.out.println(numbers);


// =========================================================
// 23. PRACTICAL - STORE STUDENT NAMES
// =========================================================

System.out.println("\n----- 23. STUDENT NAME PRACTICAL -----");

ArrayList<String> students = new ArrayList<>();

students.add("Rahul");
students.add("Priya");
students.add("Amit");
students.add("Sneha");
students.add("Karan");

System.out.println("Students:");

for (String student : students) {

System.out.println(student);

}


// =========================================================
// 24. SEARCH STUDENT
// =========================================================

System.out.println("\n----- 24. SEARCH STUDENT -----");

String searchName = "Priya";

if (students.contains(searchName)) {

System.out.println(
searchName + " found"
);

} else {

System.out.println(
searchName + " not found"
);

}


// =========================================================
// 25. REMOVE STUDENT
// =========================================================

System.out.println("\n----- 25. REMOVE STUDENT -----");

students.remove("Amit");

System.out.println("After removing Amit:");

for (String student : students) {

System.out.println(student);

}


// =========================================================
// 26. ARRAYLIST DUPLICATES
// =========================================================

System.out.println("\n----- 26. DUPLICATES IN ARRAYLIST -----");

ArrayList<Integer> duplicateNumbers =
new ArrayList<>();

duplicateNumbers.add(10);
duplicateNumbers.add(20);
duplicateNumbers.add(10);
duplicateNumbers.add(30);
duplicateNumbers.add(20);

System.out.println(duplicateNumbers);


// =========================================================
// 27. REMOVE DUPLICATES
// =========================================================

System.out.println("\n----- 27. REMOVE DUPLICATES -----");

ArrayList<Integer> uniqueNumbers =
new ArrayList<>();

for (Integer number : duplicateNumbers) {

if (!uniqueNumbers.contains(number)) {

uniqueNumbers.add(number);

}

}

System.out.println("Original: " + duplicateNumbers);
System.out.println("Without duplicates: " + uniqueNumbers);


// =========================================================
// 28. ARRAYLIST OF CUSTOM OBJECTS
// =========================================================

System.out.println("\n----- 28. ARRAYLIST OF OBJECTS -----");

ArrayList<Student> studentList =
new ArrayList<>();

studentList.add(
new Student(101, "Rahul")
);

studentList.add(
new Student(102, "Priya")
);

studentList.add(
new Student(103, "Amit")
);


for (Student student : studentList) {

System.out.println(
student.id + " - " + student.name
);

}


// =========================================================
// 29. REMOVE ALL ELEMENTS
// =========================================================

System.out.println("\n----- 29. REMOVE ALL -----");

studentList.clear();

System.out.println(
"Student List: " + studentList
);

}
}


// =============================================================
// STUDENT CLASS
// =============================================================

class Student {

int id;
String name;

Student(int id, String name) {

this.id = id;
this.name = name;

}
}
