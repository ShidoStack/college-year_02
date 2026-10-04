# Hostel Room Allotment and Mess Billing Database Using SQL

## Database Management System Project

**Technology:** PostgreSQL  
**Database:** `hostel_db`  
**Project Type:** Relational Database Management System  
**Domain:** College Hostel Management

---

# 1. Project Overview

The Hostel Room Allotment and Mess Billing Database is a PostgreSQL-based database system designed to manage hostel room allocation, student occupancy, mess attendance, and monthly mess billing.

The system models the main hostel operations using relational tables and SQL queries.

The database is designed to answer practical hostel-management questions such as:

1. How many rooms are vacant in each block?
2. What is each student's mess bill for a month?
3. Which students skipped more than 10 meals in a month?
4. What is the occupancy rate of each hostel block?
5. Which rooms were vacated but have not been re-allotted?

The project also demonstrates PostgreSQL indexing and query-performance analysis using `EXPLAIN ANALYZE`.

---

# 2. Problem Statement

Managing hostel room allocation and mess billing manually can make it difficult to maintain accurate records of:

- Available and occupied rooms
- Student room allocation history
- Student mess attendance
- Monthly mess bills
- Vacated rooms
- Hostel occupancy
- Meal consumption

A relational database can centralize this information and allow hostel administrators to retrieve useful information using SQL queries.

The database must also preserve historical room-allocation information so that a room that has been vacated can be identified and made available for future allocation.

---

# 3. Project Objectives

The main objectives of the project are:

- Model hostel blocks and rooms using relational tables.
- Store student information.
- Maintain room allocation history.
- Identify currently occupied and vacant rooms.
- Record daily mess attendance.
- Calculate monthly mess bills.
- Store meal-wise billing information.
- Answer important hostel-management queries using SQL.
- Demonstrate filtering, sorting, joins, aggregation, `GROUP BY`, `HAVING`, and subqueries.
- Create and evaluate single-column and composite indexes.
- Compare query execution plans using `EXPLAIN ANALYZE`.
- Demonstrate a case where adding an index makes a query slower.
- Explain the importance of composite-index column order.
- Document database design decisions and rejected alternatives.

---

# 4. Technology Used

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database management system |
| SQL | Database creation, data manipulation and querying |
| `EXPLAIN ANALYZE` | Query performance analysis |
| PostgreSQL indexes | Query optimization |
| ER Diagram | Database structure visualization |

---

# 5. Database Structure

The database contains the following main tables:

1. `blocks`
2. `rooms`
3. `students`
4. `room_allocations`
5. `meal_types`
6. `mess_attendance`
7. `mess_bills`
8. `mess_bill_items`

The database separates room information, students, allocations, attendance, and billing into different relations to reduce duplication and maintain clear relationships between entities.

---

# 6. Table Descriptions

## 6.1 `blocks`

Stores hostel block information.

Important columns:

- `block_id` — Primary key
- `block_name` — Unique block name
- `description` — Description of the block
- `created_at` — Record creation timestamp

---

## 6.2 `rooms`

Stores individual hostel rooms.

Important columns:

- `room_id` — Primary key
- `block_id` — References `blocks`
- `room_number` — Room number within the block
- `capacity` — Number of beds in the room
- `floor_number` — Floor on which the room is located
- `created_at` — Record creation timestamp

A unique constraint on `(block_id, room_number)` prevents duplicate room numbers within the same block.

---

## 6.3 `students`

Stores student information.

Important columns:

- `student_id` — Primary key
- `roll_number` — Unique student roll number
- `full_name`
- `gender`
- `course`
- `year_of_study`
- `phone`
- `email`
- `admission_date`
- `created_at`

The table contains validation constraints for gender and year of study.

---

6.4 `room_allocations`

Stores room-allocation history.

Important columns:

- `allocation_id` — Primary key
- `room_id` — References `rooms`
- `student_id` — References `students`
- `allocated_from` — Allocation start date
- `vacated_on` — Date the student vacated the room
- `allocation_reason`
- `created_at`

An active allocation is represented by:

```sql
vacated_on IS NULL

This allows the database to preserve historical allocations while identifying the student's current room.

A partial unique index ensures that a student cannot have more than one active room allocation.

6.5 meal_types

Stores the available meal types.

Examples include:

Breakfast
Lunch
Dinner

Important columns:

meal_type_id — Primary key
meal_name — Unique meal name
rate — Cost per meal

Keeping meal types in a separate table avoids hardcoding meal types into the attendance and billing tables.

6.6 mess_attendance

Stores daily meal attendance.

Important columns:

attendance_id — Primary key
student_id — References students
meal_type_id — References meal_types
attendance_date
consumed
recorded_at

The unique constraint:

(student_id, meal_type_id, attendance_date)

prevents duplicate attendance records for the same student, meal type, and date.

6.7 mess_bills

Stores monthly student mess bills.

Important columns:

bill_id — Primary key
student_id — References students
billing_month
total_amount
generated_at
status

The unique constraint:

(student_id, billing_month)

ensures that a student has at most one bill for a particular billing month.

Allowed bill statuses are:

Generated
Paid
Pending
6.8 mess_bill_items

Stores the meal-wise breakdown of a mess bill.

Important columns:

bill_item_id — Primary key
bill_id — References mess_bills
meal_type_id — References meal_types
meals_consumed
rate_per_meal
amount

The unique constraint:

(bill_id, meal_type_id)

prevents duplicate meal-type entries within the same bill.

7. Relationships

The major relationships are:

blocks
   |
   | 1-to-many
   v
rooms
   |
   | 1-to-many
   v
room_allocations
   ^
   |
   | many-to-1
   |
students
   |
   | 1-to-many
   v
mess_attendance
   |
   | many-to-1
   v
meal_types


students
   |
   | 1-to-many
   v
mess_bills
   |
   | 1-to-many
   v
mess_bill_items
   |
   | many-to-1
   v
meal_types
8. Business Rules

The database implements the following important rules.

Rule 1 — A room belongs to a block

Every room must reference an existing hostel block.

Rule 2 — Room numbers are unique within a block

The combination:

(block_id, room_number)

must be unique.

This allows different blocks to contain rooms with the same room number.

Rule 3 — A student can have only one active room allocation

An active allocation is identified by:

vacated_on IS NULL

The partial unique index:

CREATE UNIQUE INDEX uq_active_student_allocation
ON room_allocations(student_id)
WHERE vacated_on IS NULL;

prevents the same student from being assigned to multiple active rooms.

Rule 4 — Historical allocations are retained

When a student vacates a room, the allocation record is not deleted.

Instead:

vacated_on

is populated.

This preserves room-allocation history and allows the room to be re-allotted.

Rule 5 — One attendance record per student, meal and date

The following combination is unique:

student_id
meal_type_id
attendance_date

This prevents duplicate attendance entries.

Rule 6 — One bill per student per month

The following combination is unique:

student_id
billing_month

This prevents duplicate monthly bills.

9. Seed Data

The project uses a realistic dataset instead of only a few sample records.

The seeded dataset contains approximately:

Data	Quantity
Hostel blocks	8
Rooms	240
Students	400
Room allocations	400
Meal types	3
Mess attendance records	36,000
Monthly mess bills	400
Bill items	Approximately 1,200

Attendance data covers September 2026.

The attendance dataset contains:

400 students × 30 days × 3 meal types
= 36,000 attendance records

The seed data also intentionally creates students who skipped more than 10 meals so that the corresponding business query produces meaningful results.

10. Required Business Queries

The project implements queries for the five required hostel-management questions.

Query 1 — Vacant rooms in each block

The query counts rooms that do not currently have an active allocation.

An active allocation is identified using:

vacated_on IS NULL

The query uses NOT EXISTS to determine whether a room has an active allocation.

Query 2 — Each student's monthly mess bill

The query joins:

students
    |
    v
mess_bills

and retrieves the September 2026 bill for every student.

Query 3 — Students who skipped more than 10 meals

The query filters attendance records where:

consumed = FALSE

and groups records by student.

The HAVING clause is used to keep only students with more than 10 skipped meals:

HAVING COUNT(*) > 10
Query 4 — Occupancy rate of each block

Occupancy is calculated using:

occupied beds / total bed capacity × 100

Only active room allocations are counted as occupied.

The query uses:

JOIN
LEFT JOIN
SUM
COUNT
GROUP BY
ROUND
Query 5 — Vacated rooms that have not been re-allotted

The query identifies rooms with historical allocations where:

vacated_on IS NOT NULL

and no current allocation exists.

A NOT EXISTS subquery is used to identify rooms that remain unallocated.

11. Additional Queries

Additional queries were included to demonstrate SQL operations useful in the hostel-management system.

These include:

Current students and their room details
Pending/generated bills
Total September mess revenue
Meal consumption summary
Top 10 highest mess bills

These queries demonstrate joins, filtering, aggregation, ordering, and grouping.

12. Index Design

Indexes were designed based on the expected access patterns of the database.

The final explicit performance indexes are:

Index	Column	Purpose
idx_attendance_date	attendance_date	Attendance queries by date
idx_attendance_meal_type_id	meal_type_id	Attendance filtering/joining by meal
idx_allocations_room_id	room_id	Room allocation history
idx_allocations_student_id	student_id	Student allocation history
idx_bills_student_id	student_id	Student billing history

Primary-key and unique-constraint indexes are created automatically by PostgreSQL and are not recreated manually.

13. EXPLAIN ANALYZE Experiments

The project uses:

EXPLAIN (ANALYZE, BUFFERS)

to inspect:

Execution plans
Sequential scans
Index scans
Bitmap scans
Buffer usage
Actual execution time

Five experiments were performed.

Experiment 1 — Index that made a query slower

Query:

Students who skipped more than 10 meals.

Test index:

CREATE INDEX idx_mess_attendance_date_consumed
ON mess_attendance(attendance_date, consumed);
Before
Sequential Scan
Execution Time: 4.463 ms
After
Bitmap Index Scan
Bitmap Heap Scan
Execution Time: 5.695 ms

The index made the query slower.

Explanation

The table contains only 36,000 attendance records, and the query still matched 3,100 rows.

Using the index introduced additional work:

Index lookup
     +
Heap page access

For this dataset, PostgreSQL's original sequential scan was cheaper.

This demonstrates that adding an index does not guarantee better performance.

The test index was removed from the final design.

14. Experiment 2 — Index ignored because all rows matched

A test index was created on:

billing_month

for the monthly bill query.

Before
Sequential Scan
Execution Time: 1.571 ms
After
Sequential Scan
Execution Time: 0.793 ms

PostgreSQL continued to use a sequential scan.

The query matched all 400 rows in mess_bills, so using an index would not provide a useful reduction in the amount of data that needed to be processed.

The lower measured execution time after index creation is not considered an index improvement because the execution plan remained a sequential scan.

The test index was removed.

15. Experiment 3 — Composite index column order

A composite index was tested:

CREATE INDEX idx_mess_attendance_student_date_consumed
ON mess_attendance(student_id, attendance_date, consumed);

The query primarily filters using:

attendance_date
consumed

but does not first restrict:

student_id
Result

PostgreSQL continued to use a sequential scan.

Explanation

The leading column of a composite index is important.

The tested index starts with:

student_id

while the query needs efficient filtering beginning with:

attendance_date

Therefore, the index was not useful for this query.

The test index was removed.

This experiment demonstrates why composite-index column order must be chosen according to query access patterns.

16. Experiment 4 — Index on room allocation vacancy lookup

A composite index was tested:

CREATE INDEX idx_room_allocations_room_vacated
ON room_allocations(room_id, vacated_on);
Before
Sequential Scan
Execution Time: 1.226 ms
After
Sequential Scan
Execution Time: 0.635 ms

PostgreSQL continued to use a sequential scan.

The room_allocations table contains only 400 rows, so scanning the table remained inexpensive.

The lower runtime was not treated as proof of an index improvement because the execution plan remained unchanged.

The test index was removed.

17. Experiment 5 — Successful index optimization

The strongest successful experiment used:

CREATE INDEX idx_attendance_date
ON mess_attendance(attendance_date);

The query retrieves attendance statistics for:

2026-09-15
Before
Sequential Scan
Rows matched: 1,200
Rows removed by filter: 34,800
Buffers: 300
Execution Time: 3.937 ms
After
Index Scan
Rows matched: 1,200
Buffers: approximately 13
Execution Time: 0.372 ms
Performance improvement
3.937 ms / 0.372 ms ≈ 10.6x

The execution plan changed from:

Sequential Scan

to:

Index Scan

This is a clear example of an index helping a selective query.

The idx_attendance_date index was retained in the final design.

18. Summary of Index Experiments
Experiment	Result	Final Decision
Attendance (date, consumed)	Became slower	Rejected
Bills billing_month	Sequential scan remained	Rejected
Attendance (student_id, date, consumed)	Index not used	Rejected
Allocations (room_id, vacated_on)	Sequential scan remained	Rejected
Attendance date	About 10.6x faster	Retained
19. Design Decisions
Decision 1 — Separate room allocation history

Instead of storing only the current room directly in the student table, room allocations are stored separately.

This allows:

Historical allocations
Vacating dates
Re-allocation
Current occupancy detection
Decision 2 — Use vacated_on IS NULL for active allocations

An allocation without a vacated_on date represents a currently active allocation.

This avoids deleting historical allocation records.

Decision 3 — Separate meal types

Meal types are stored in their own table rather than creating columns such as:

breakfast_consumed
lunch_consumed
dinner_consumed

This makes the design more flexible and normalized.

Decision 4 — Separate bill items

Meal-wise bill details are stored in mess_bill_items.

This allows a bill to contain separate values for:

Breakfast
Lunch
Dinner

including consumed quantity, rate and amount.

Decision 5 — Composite uniqueness for attendance

The combination:

student_id
meal_type_id
attendance_date

was chosen as a unique constraint because a student should have only one attendance record for a particular meal on a particular day.

20. Rejected Alternatives
Alternative 1 — Store only the student's current room

This would make historical room allocations difficult to maintain.

The chosen room_allocations table preserves allocation history.

Alternative 2 — Store breakfast, lunch and dinner as separate columns

This would make the attendance structure less flexible and would require schema changes if new meal types were introduced.

The separate meal_types relation provides a cleaner relational design.

Alternative 3 — Add indexes to every searchable column

This was rejected because unnecessary indexes:

consume storage
increase maintenance overhead
can slow INSERT, UPDATE, and DELETE
may not improve queries on small tables

The project experiments demonstrate that PostgreSQL may prefer sequential scans even when an index exists.

Alternative 4 — Use a composite index without considering column order

The experiment with:

(student_id, attendance_date, consumed)

showed that an index can be ineffective when its leading column does not match the query's filtering pattern.

21. Project Files

The project directory contains:

hostel-dbms/
│
├── schema.sql
├── seed.sql
├── indexes.sql
├── queries.sql
├── explain_analyze.sql
├── Readme.md
│
└── screenshots/
    ├── query1_before.png
    ├── query1_after.png
    ├── query2_before.png
    ├── query2_after.png
    ├── query3_before.png
    ├── query3_after.png
    ├── query4_before.png
    ├── query4_after.png
    ├── query5_before.png
    └── query5_after.png
22. How to Run the Project
Step 1 — Create the database

From PostgreSQL:

CREATE DATABASE hostel_db;

Connect to it:

\c hostel_db
Step 2 — Create the schema

From the terminal:

psql -d hostel_db -f schema.sql
Step 3 — Insert the seed data
psql -d hostel_db -f seed.sql
Step 4 — Create final performance indexes
psql -d hostel_db -f indexes.sql
Step 5 — Run the required queries
psql -d hostel_db -f queries.sql
Step 6 — Run EXPLAIN ANALYZE experiments
psql -d hostel_db -f explain_analyze.sql
23. Verification

Useful verification commands include:

\dt

To inspect a table:

\d mess_attendance

To inspect final indexes:

SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

To check attendance volume:

SELECT COUNT(*)
FROM mess_attendance;

To check the number of students:

SELECT COUNT(*)
FROM students;

To check monthly bills:

SELECT COUNT(*)
FROM mess_bills;
24. Conclusion

The project demonstrates how a relational database can be used to manage hostel room allocation, student occupancy, mess attendance and monthly billing.

The database preserves room-allocation history while allowing current vacancies to be identified using active allocations.

SQL queries demonstrate joins, filtering, aggregation, grouping, HAVING, ordering and subqueries.

The indexing experiments demonstrate an important database-management principle:

An index is not automatically beneficial for every query.

The project showed both successful and unsuccessful indexing strategies.

The most successful experiment used an index on attendance_date, reducing the measured execution time from:

3.937 ms

to:

0.372 ms

and changing the execution plan from a sequential scan to an index scan.

The project also demonstrated that composite-index column order matters and that PostgreSQL may correctly choose a sequential scan for small or low-selectivity tables.

Overall, the database provides a normalized relational model for the hostel-management case study while demonstrating practical PostgreSQL query optimization and index design.