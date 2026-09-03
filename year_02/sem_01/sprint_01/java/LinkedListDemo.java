import java.util.LinkedList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;

public class LinkedListDemo {

public static void main(String[] args) {

// =========================================================
// 1. CREATE LINKEDLIST
// =========================================================

System.out.println("----- 1. CREATE LINKEDLIST -----");

LinkedList<String> names = new LinkedList<>();

System.out.println("LinkedList created");


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
// 4. ADD FIRST
// =========================================================

System.out.println("\n----- 4. ADD FIRST -----");

names.addFirst("Karan");

System.out.println(names);


// =========================================================
// 5. ADD LAST
// =========================================================

System.out.println("\n----- 5. ADD LAST -----");

names.addLast("Neha");

System.out.println(names);


// =========================================================
// 6. ADD ANOTHER COLLECTION
// =========================================================

System.out.println("\n----- 6. ADD ANOTHER COLLECTION -----");

LinkedList<String> newNames =
new LinkedList<>(
Arrays.asList("Vijay", "Pooja")
);

names.addAll(newNames);

System.out.println(names);


// =========================================================
// 7. GET ELEMENT
// =========================================================

System.out.println("\n----- 7. GET ELEMENT -----");

System.out.println(
"Element at index 2: " + names.get(2)
);


// =========================================================
// 8. GET FIRST ELEMENT
// =========================================================

System.out.println("\n----- 8. GET FIRST -----");

System.out.println(
"First element: " + names.getFirst()
);


// =========================================================
// 9. GET LAST ELEMENT
// =========================================================

System.out.println("\n----- 9. GET LAST -----");

System.out.println(
"Last element: " + names.getLast()
);


// =========================================================
// 10. UPDATE ELEMENT
// =========================================================

System.out.println("\n----- 10. UPDATE ELEMENT -----");

names.set(2, "Akshay");

System.out.println(names);


// =========================================================
// 11. REMOVE USING INDEX
// =========================================================

System.out.println("\n----- 11. REMOVE USING INDEX -----");

names.remove(1);

System.out.println(names);


// =========================================================
// 12. REMOVE USING VALUE
// =========================================================

System.out.println("\n----- 12. REMOVE USING VALUE -----");

names.remove("Sneha");

System.out.println(names);


// =========================================================
// 13. REMOVE FIRST
// =========================================================

System.out.println("\n----- 13. REMOVE FIRST -----");

names.removeFirst();

System.out.println(names);


// =========================================================
// 14. REMOVE LAST
// =========================================================

System.out.println("\n----- 14. REMOVE LAST -----");

names.removeLast();

System.out.println(names);


// =========================================================
// 15. PEEK
// =========================================================

System.out.println("\n----- 15. PEEK -----");

System.out.println(
"Peek: " + names.peek()
);


// =========================================================
// 16. PEEK FIRST
// =========================================================

System.out.println("\n----- 16. PEEK FIRST -----");

System.out.println(
"Peek First: " + names.peekFirst()
);


// =========================================================
// 17. PEEK LAST
// =========================================================

System.out.println("\n----- 17. PEEK LAST -----");

System.out.println(
"Peek Last: " + names.peekLast()
);


// =========================================================
// 18. OFFER
// =========================================================

System.out.println("\n----- 18. OFFER -----");

names.offer("Sahil");

System.out.println(names);


// =========================================================
// 19. OFFER FIRST
// =========================================================

System.out.println("\n----- 19. OFFER FIRST -----");

names.offerFirst("Meena");

System.out.println(names);


// =========================================================
// 20. OFFER LAST
// =========================================================

System.out.println("\n----- 20. OFFER LAST -----");

names.offerLast("Ravi");

System.out.println(names);


// =========================================================
// 21. POLL
// =========================================================

System.out.println("\n----- 21. POLL -----");

String removed = names.poll();

System.out.println("Removed: " + removed);
System.out.println(names);


// =========================================================
// 22. POLL FIRST
// =========================================================

System.out.println("\n----- 22. POLL FIRST -----");

System.out.println(
"Removed: " + names.pollFirst()
);

System.out.println(names);


// =========================================================
// 23. POLL LAST
// =========================================================

System.out.println("\n----- 23. POLL LAST -----");

System.out.println(
"Removed: " + names.pollLast()
);

System.out.println(names);


// =========================================================
// 24. CONTAINS
// =========================================================

System.out.println("\n----- 24. CONTAINS -----");

System.out.println(
"Contains Rahul? " +
names.contains("Rahul")
);


// =========================================================
// 25. SIZE
// =========================================================

System.out.println("\n----- 25. SIZE -----");

System.out.println(
"Total elements: " + names.size()
);


// =========================================================
// 26. ISEMPTY
// =========================================================

System.out.println("\n----- 26. ISEMPTY -----");

System.out.println(
"Is empty? " + names.isEmpty()
);


// =========================================================
// 27. INDEX OF
// =========================================================

System.out.println("\n----- 27. INDEX OF -----");

System.out.println(
"Index of Rahul: " +
names.indexOf("Rahul")
);


// =========================================================
// 28. LAST INDEX OF
// =========================================================

System.out.println("\n----- 28. LAST INDEX OF -----");

names.add("Rahul");

System.out.println(
"Last index of Rahul: " +
names.lastIndexOf("Rahul")
);


// =========================================================
// 29. NORMAL FOR LOOP
// =========================================================

System.out.println("\n----- 29. FOR LOOP -----");

for (int i = 0; i < names.size(); i++) {

System.out.println(names.get(i));

}


// =========================================================
// 30. FOR-EACH LOOP
// =========================================================

System.out.println("\n----- 30. FOR-EACH LOOP -----");

for (String name : names) {

System.out.println(name);

}


// =========================================================
// 31. ITERATOR
// =========================================================

System.out.println("\n----- 31. ITERATOR -----");

Iterator<String> iterator =
names.iterator();

while (iterator.hasNext()) {

System.out.println(iterator.next());

}


// =========================================================
// 32. SORT
// =========================================================

System.out.println("\n----- 32. SORT -----");

Collections.sort(names);

System.out.println(names);


// =========================================================
// 33. REVERSE
// =========================================================

System.out.println("\n----- 33. REVERSE -----");

Collections.reverse(names);

System.out.println(names);


// =========================================================
// 34. INTEGER LINKEDLIST
// =========================================================

System.out.println("\n----- 34. INTEGER LINKEDLIST -----");

LinkedList<Integer> numbers =
new LinkedList<>();

numbers.add(30);
numbers.add(10);
numbers.add(20);
numbers.add(40);

System.out.println(numbers);


// =========================================================
// 35. SORT INTEGER LINKEDLIST
// =========================================================

System.out.println("\n----- 35. SORT INTEGER LINKEDLIST -----");

Collections.sort(numbers);

System.out.println(numbers);


// =========================================================
// 36. REMOVE DUPLICATES
// =========================================================

System.out.println("\n----- 36. REMOVE DUPLICATES -----");

LinkedList<Integer> duplicateNumbers =
new LinkedList<>();

duplicateNumbers.add(10);
duplicateNumbers.add(20);
duplicateNumbers.add(10);
duplicateNumbers.add(30);
duplicateNumbers.add(20);
duplicateNumbers.add(40);

LinkedList<Integer> uniqueNumbers =
new LinkedList<>();

for (Integer number : duplicateNumbers) {

if (!uniqueNumbers.contains(number)) {

uniqueNumbers.add(number);

}

}

System.out.println(
"Original: " + duplicateNumbers
);

System.out.println(
"Without duplicates: " + uniqueNumbers
);


// =========================================================
// 37. PRACTICAL - STUDENT LIST
// =========================================================

System.out.println("\n----- 37. STUDENT LIST PRACTICAL -----");

LinkedList<String> students =
new LinkedList<>();

students.add("Rahul");
students.add("Priya");
students.add("Amit");
students.add("Sneha");

System.out.println("Students:");

for (String student : students) {

System.out.println(student);

}


// =========================================================
// 38. SEARCH STUDENT
// =========================================================

System.out.println("\n----- 38. SEARCH STUDENT -----");

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
// 39. ADD STUDENT AT BEGINNING
// =========================================================

System.out.println("\n----- 39. ADD STUDENT AT BEGINNING -----");

students.addFirst("Karan");

System.out.println(students);


// =========================================================
// 40. REMOVE STUDENT
// =========================================================

System.out.println("\n----- 40. REMOVE STUDENT -----");

students.remove("Amit");

System.out.println(students);


// =========================================================
// 41. LINKEDLIST OF OBJECTS
// =========================================================

System.out.println("\n----- 41. LINKEDLIST OF OBJECTS -----");

LinkedList<Student> studentList =
new LinkedList<>();

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
student.id + " - " +
student.name
);

}


// =========================================================
// 42. CLEAR
// =========================================================

System.out.println("\n----- 42. CLEAR -----");

studentList.clear();

System.out.println(
"After clear: " + studentList
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
