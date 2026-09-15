import java.util.HashSet;
import java.util.TreeSet;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.Set;
import java.util.Map;
import java.util.SortedMap;
import java.util.NavigableMap;

public class HashTreeSetMap {

public static void main(String[] args) {


// =========================================================
// 1. HASHSET - CREATE AND ADD ELEMENTS
// =========================================================

System.out.println("----- 1. HASHSET -----");

HashSet<String> names = new HashSet<>();

names.add("Rahul");
names.add("Priya");
names.add("Amit");
names.add("Sneha");

System.out.println(names);


// =========================================================
// 2. HASHSET - DUPLICATES
// =========================================================

System.out.println("\n----- 2. HASHSET - DUPLICATES -----");

names.add("Rahul");
names.add("Priya");

System.out.println(names);

System.out.println(
"HashSet size: " + names.size()
);


// =========================================================
// 3. HASHSET - CONTAINS
// =========================================================

System.out.println("\n----- 3. HASHSET - CONTAINS -----");

System.out.println(
"Contains Rahul? " +
names.contains("Rahul")
);

System.out.println(
"Contains Karan? " +
names.contains("Karan")
);


// =========================================================
// 4. HASHSET - REMOVE
// =========================================================

System.out.println("\n----- 4. HASHSET - REMOVE -----");

names.remove("Amit");

System.out.println(names);


// =========================================================
// 5. HASHSET - ITERATION
// =========================================================

System.out.println("\n----- 5. HASHSET - ITERATION -----");

for (String name : names) {

System.out.println(name);

}


// =========================================================
// 6. HASHSET - SIZE AND EMPTY
// =========================================================

System.out.println("\n----- 6. HASHSET - SIZE / EMPTY -----");

System.out.println(
"Size: " + names.size()
);

System.out.println(
"Is Empty: " + names.isEmpty()
);


// =========================================================
// 7. TREESET - CREATE AND ADD
// =========================================================

System.out.println("\n----- 7. TREESET -----");

TreeSet<Integer> numbers = new TreeSet<>();

numbers.add(50);
numbers.add(10);
numbers.add(30);
numbers.add(20);
numbers.add(40);

System.out.println(numbers);


// =========================================================
// 8. TREESET - DUPLICATES
// =========================================================

System.out.println("\n----- 8. TREESET - DUPLICATES -----");

numbers.add(20);
numbers.add(30);

System.out.println(numbers);


// =========================================================
// 9. TREESET - FIRST AND LAST
// =========================================================

System.out.println("\n----- 9. TREESET - FIRST / LAST -----");

System.out.println(
"First: " + numbers.first()
);

System.out.println(
"Last: " + numbers.last()
);


// =========================================================
// 10. TREESET - LOWER / HIGHER
// =========================================================

System.out.println("\n----- 10. TREESET - LOWER / HIGHER -----");

System.out.println(
"Lower than 30: " +
numbers.lower(30)
);

System.out.println(
"Higher than 30: " +
numbers.higher(30)
);


// =========================================================
// 11. TREESET - FLOOR / CEILING
// =========================================================

System.out.println("\n----- 11. TREESET - FLOOR / CEILING -----");

System.out.println(
"Floor of 35: " +
numbers.floor(35)
);

System.out.println(
"Ceiling of 35: " +
numbers.ceiling(35)
);


// =========================================================
// 12. TREESET - ITERATION
// =========================================================

System.out.println("\n----- 12. TREESET - ITERATION -----");

for (Integer number : numbers) {

System.out.println(number);

}


// =========================================================
// 13. TREESET - REMOVE
// =========================================================

System.out.println("\n----- 13. TREESET - REMOVE -----");

numbers.remove(30);

System.out.println(numbers);


// =========================================================
// 14. EMPLOYEE INFORMATION USING HASHSET
// =========================================================

System.out.println("\n----- 14. EMPLOYEE INFORMATION - HASHSET -----");

HashSet<Employee> employees =
new HashSet<>();

employees.add(
new Employee(101, "Rahul", 50000)
);

employees.add(
new Employee(102, "Priya", 60000)
);

employees.add(
new Employee(103, "Amit", 55000)
);


for (Employee employee : employees) {

System.out.println(employee);

}


// =========================================================
// 15. EMPLOYEE INFORMATION USING TREESET
// =========================================================

System.out.println("\n----- 15. EMPLOYEE INFORMATION - TREESET -----");

TreeSet<Employee> sortedEmployees =
new TreeSet<>(
(e1, e2) ->
Integer.compare(e1.id, e2.id)
);

sortedEmployees.add(
new Employee(103, "Amit", 55000)
);

sortedEmployees.add(
new Employee(101, "Rahul", 50000)
);

sortedEmployees.add(
new Employee(102, "Priya", 60000)
);


for (Employee employee : sortedEmployees) {

System.out.println(employee);

}


// =========================================================
// 16. HASHMAP - CREATE
// =========================================================

System.out.println("\n----- 16. HASHMAP -----");

HashMap<Integer, String> students =
new HashMap<>();

students.put(101, "Rahul");
students.put(102, "Priya");
students.put(103, "Amit");

System.out.println(students);


// =========================================================
// 17. HASHMAP - GET
// =========================================================

System.out.println("\n----- 17. HASHMAP - GET -----");

System.out.println(
"Student 102: " +
students.get(102)
);


// =========================================================
// 18. HASHMAP - UPDATE VALUE
// =========================================================

System.out.println("\n----- 18. HASHMAP - UPDATE -----");

students.put(102, "Sneha");

System.out.println(students);


// =========================================================
// 19. HASHMAP - DUPLICATE KEY
// =========================================================

System.out.println("\n----- 19. HASHMAP - DUPLICATE KEY -----");

students.put(101, "Karan");

System.out.println(students);

/*
Key 101 already exists.

Old value:
Rahul

New value:
Karan

Value gets replaced.
*/


// =========================================================
// 20. HASHMAP - CONTAINS KEY
// =========================================================

System.out.println("\n----- 20. CONTAINS KEY -----");

System.out.println(
"Contains key 101? " +
students.containsKey(101)
);


// =========================================================
// 21. HASHMAP - CONTAINS VALUE
// =========================================================

System.out.println("\n----- 21. CONTAINS VALUE -----");

System.out.println(
"Contains Priya? " +
students.containsValue("Priya")
);


// =========================================================
// 22. HASHMAP - REMOVE
// =========================================================

System.out.println("\n----- 22. HASHMAP - REMOVE -----");

students.remove(103);

System.out.println(students);


// =========================================================
// 23. HASHMAP - SIZE
// =========================================================

System.out.println("\n----- 23. HASHMAP - SIZE -----");

System.out.println(
"Size: " + students.size()
);


// =========================================================
// 24. HASHMAP - ITERATE KEYS
// =========================================================

System.out.println("\n----- 24. HASHMAP - KEYS -----");

for (Integer key : students.keySet()) {

System.out.println(key);

}


// =========================================================
// 25. HASHMAP - ITERATE VALUES
// =========================================================

System.out.println("\n----- 25. HASHMAP - VALUES -----");

for (String value : students.values()) {

System.out.println(value);

}


// =========================================================
// 26. HASHMAP - ITERATE KEY + VALUE
// =========================================================

System.out.println("\n----- 26. HASHMAP - KEY + VALUE -----");

for (Map.Entry<Integer, String> entry
: students.entrySet()) {

System.out.println(
entry.getKey() +
" -> " +
entry.getValue()
);

}


// =========================================================
// 27. PHONE DIRECTORY USING HASHMAP
// =========================================================

System.out.println("\n----- 27. PHONE DIRECTORY -----");

HashMap<String, String> phoneBook =
new HashMap<>();

phoneBook.put("Rahul", "9876543210");
phoneBook.put("Priya", "9876543211");
phoneBook.put("Amit", "9876543212");
phoneBook.put("Sneha", "9876543213");


System.out.println(
"Rahul's Number: " +
phoneBook.get("Rahul")
);

System.out.println(
"Priya's Number: " +
phoneBook.get("Priya")
);


// =========================================================
// 28. SEARCH PHONE NUMBER
// =========================================================

System.out.println("\n----- 28. SEARCH PHONE NUMBER -----");

String searchPerson = "Amit";

if (phoneBook.containsKey(searchPerson)) {

System.out.println(
searchPerson +
"'s number: " +
phoneBook.get(searchPerson)
);

} else {

System.out.println(
"Person not found"
);

}


// =========================================================
// 29. TREE MAP
// =========================================================

System.out.println("\n----- 29. TREEMAP -----");

TreeMap<Integer, String> sortedStudents =
new TreeMap<>();

sortedStudents.put(103, "Amit");
sortedStudents.put(101, "Rahul");
sortedStudents.put(105, "Sneha");
sortedStudents.put(102, "Priya");
sortedStudents.put(104, "Karan");

System.out.println(sortedStudents);


// =========================================================
// 30. TREEMAP - FIRST AND LAST KEY
// =========================================================

System.out.println("\n----- 30. TREEMAP - FIRST / LAST KEY -----");

System.out.println(
"First Key: " +
sortedStudents.firstKey()
);

System.out.println(
"Last Key: " +
sortedStudents.lastKey()
);


// =========================================================
// 31. TREEMAP - LOWER / HIGHER KEY
// =========================================================

System.out.println("\n----- 31. LOWER / HIGHER KEY -----");

System.out.println(
"Lower than 103: " +
sortedStudents.lowerKey(103)
);

System.out.println(
"Higher than 103: " +
sortedStudents.higherKey(103)
);


// =========================================================
// 32. TREEMAP - FLOOR / CEILING KEY
// =========================================================

System.out.println("\n----- 32. FLOOR / CEILING KEY -----");

System.out.println(
"Floor of 103: " +
sortedStudents.floorKey(103)
);

System.out.println(
"Ceiling of 103: " +
sortedStudents.ceilingKey(103)
);


// =========================================================
// 33. TREEMAP - GET
// =========================================================

System.out.println("\n----- 33. TREEMAP - GET -----");

System.out.println(
sortedStudents.get(102)
);


// =========================================================
// 34. TREEMAP - ITERATION
// =========================================================

System.out.println("\n----- 34. TREEMAP - ITERATION -----");

for (Map.Entry<Integer, String> entry
: sortedStudents.entrySet()) {

System.out.println(
entry.getKey() +
" -> " +
entry.getValue()
);

}


// =========================================================
// 35. SORTEDMAP
// =========================================================

System.out.println("\n----- 35. SORTEDMAP -----");

SortedMap<Integer, String> sortedMap =
new TreeMap<>();

sortedMap.put(10, "A");
sortedMap.put(30, "C");
sortedMap.put(20, "B");
sortedMap.put(40, "D");

System.out.println(sortedMap);


// =========================================================
// 36. SORTEDMAP METHODS
// =========================================================

System.out.println("\n----- 36. SORTEDMAP METHODS -----");

System.out.println(
"First Key: " +
sortedMap.firstKey()
);

System.out.println(
"Last Key: " +
sortedMap.lastKey()
);

System.out.println(
"SubMap: " +
sortedMap.subMap(20, 40)
);

System.out.println(
"HeadMap: " +
sortedMap.headMap(30)
);

System.out.println(
"TailMap: " +
sortedMap.tailMap(30)
);


// =========================================================
// 37. NAVIGABLEMAP
// =========================================================

System.out.println("\n----- 37. NAVIGABLEMAP -----");

NavigableMap<Integer, String> navigableMap =
new TreeMap<>();

navigableMap.put(10, "A");
navigableMap.put(20, "B");
navigableMap.put(30, "C");
navigableMap.put(40, "D");
navigableMap.put(50, "E");

System.out.println(navigableMap);


// =========================================================
// 38. NAVIGABLEMAP - LOWER ENTRY
// =========================================================

System.out.println("\n----- 38. LOWER ENTRY -----");

System.out.println(
navigableMap.lowerEntry(30)
);


// =========================================================
// 39. NAVIGABLEMAP - FLOOR ENTRY
// =========================================================

System.out.println("\n----- 39. FLOOR ENTRY -----");

System.out.println(
navigableMap.floorEntry(35)
);


// =========================================================
// 40. NAVIGABLEMAP - CEILING ENTRY
// =========================================================

System.out.println("\n----- 40. CEILING ENTRY -----");

System.out.println(
navigableMap.ceilingEntry(35)
);


// =========================================================
// 41. NAVIGABLEMAP - HIGHER ENTRY
// =========================================================

System.out.println("\n----- 41. HIGHER ENTRY -----");

System.out.println(
navigableMap.higherEntry(30)
);


// =========================================================
// 42. NAVIGABLEMAP - FIRST / LAST ENTRY
// =========================================================

System.out.println("\n----- 42. FIRST / LAST ENTRY -----");

System.out.println(
"First: " +
navigableMap.firstEntry()
);

System.out.println(
"Last: " +
navigableMap.lastEntry()
);


// =========================================================
// 43. NAVIGABLEMAP - DESCENDING MAP
// =========================================================

System.out.println("\n----- 43. DESCENDING MAP -----");

System.out.println(
navigableMap.descendingMap()
);


// =========================================================
// 44. NAVIGABLEMAP - RANGE
// =========================================================

System.out.println("\n----- 44. RANGE -----");

System.out.println(
navigableMap.subMap(
20,
true,
40,
true
)
);


// =========================================================
// 45. CLEAR
// =========================================================

System.out.println("\n----- 45. CLEAR -----");

navigableMap.clear();

System.out.println(navigableMap);

}


// =============================================================
// EMPLOYEE CLASS
// =============================================================

static class Employee {

int id;
String name;
double salary;

Employee(int id, String name, double salary) {

this.id = id;
this.name = name;
this.salary = salary;

}

@Override
public String toString() {

return id +
" - " +
name +
" - ₹" +
salary;
}
}
}