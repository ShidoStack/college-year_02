-- ============================================================
-- HOSTEL ROOM ALLOTMENT AND MESS BILLING
-- Final Performance Index Design
-- PostgreSQL
-- ============================================================
--
-- This file contains performance-oriented indexes only.
--
-- Structural indexes created automatically by PostgreSQL
-- through PRIMARY KEY and UNIQUE constraints are not repeated.
--
-- Run after:
--   1. schema.sql
--   2. seed.sql
--
-- Example:
--   psql -d hostel_db -f indexes.sql
-- ============================================================


-- ============================================================
-- 1. MESS ATTENDANCE BY DATE
-- ============================================================
--
-- Supports queries that filter attendance by a specific
-- date or date range.
--
-- EXPLAIN ANALYZE experiment:
--
-- Before:
--   Sequential Scan
--   Execution Time: 3.937 ms
--
-- After:
--   Index Scan
--   Execution Time: 0.372 ms
--
-- Approximate improvement: 10.6x faster
--
-- Buffers:
--   Before: 300 shared hits
--   After:  13 shared hits
--
-- This is the strongest demonstrated index improvement
-- in the project.

CREATE INDEX IF NOT EXISTS idx_attendance_date
ON mess_attendance(attendance_date);


-- ============================================================
-- 2. MESS ATTENDANCE BY MEAL TYPE
-- ============================================================
--
-- Supports filtering and joining attendance records
-- by meal type.

CREATE INDEX IF NOT EXISTS idx_attendance_meal_type_id
ON mess_attendance(meal_type_id);


-- ============================================================
-- 3. ROOM ALLOCATIONS BY ROOM
-- ============================================================
--
-- Supports finding allocation history for a particular room.
--
-- Useful for:
--   - room occupancy checks
--   - previous occupants
--   - identifying vacated rooms
--   - room allocation history

CREATE INDEX IF NOT EXISTS idx_allocations_room_id
ON room_allocations(room_id);


-- ============================================================
-- 4. ROOM ALLOCATIONS BY STUDENT
-- ============================================================
--
-- Supports finding allocation history for a particular
-- student.

CREATE INDEX IF NOT EXISTS idx_allocations_student_id
ON room_allocations(student_id);


-- ============================================================
-- 5. MESS BILLS BY STUDENT
-- ============================================================
--
-- Supports retrieving the billing history of a student.

CREATE INDEX IF NOT EXISTS idx_bills_student_id
ON mess_bills(student_id);


-- ============================================================
-- INDEX DESIGN EXPERIMENTS
-- ============================================================
--
-- The following indexes were tested during the project but
-- are intentionally NOT retained in the final design.
--
-- ------------------------------------------------------------
-- A. idx_mess_attendance_date_consumed
-- ------------------------------------------------------------
--
-- Tested:
--
-- CREATE INDEX idx_mess_attendance_date_consumed
-- ON mess_attendance(attendance_date, consumed);
--
-- Result:
--   Before: 4.463 ms
--   After:  5.695 ms
--
-- PostgreSQL changed from a Sequential Scan to a
-- Bitmap Index Scan + Bitmap Heap Scan, but the indexed
-- approach was slower for this dataset.
--
-- Reason:
--   mess_attendance contains only 36,000 rows and the query
--   still matched 3,100 rows. For this relatively small table
--   and moderately selective condition, the cost of using the
--   index and visiting heap pages was greater than scanning
--   the table sequentially.
--
-- This provides the required example where adding an index
-- made a query slower.


-- ------------------------------------------------------------
-- B. idx_mess_attendance_student_date_consumed
-- ------------------------------------------------------------
--
-- Tested:
--
-- CREATE INDEX idx_mess_attendance_student_date_consumed
-- ON mess_attendance(student_id, attendance_date, consumed);
--
-- Result:
--   PostgreSQL continued to use a Sequential Scan.
--
-- Reason:
--   The query filtered primarily by attendance_date and
--   consumed, while student_id was the leading column of the
--   composite index.
--
-- The leading-column order of a composite index matters.
--
-- The index was therefore not retained.


-- ------------------------------------------------------------
-- C. idx_mess_bills_billing_month
-- ------------------------------------------------------------
--
-- Tested:
--
-- CREATE INDEX idx_mess_bills_billing_month
-- ON mess_bills(billing_month);
--
-- Result:
--   PostgreSQL continued to use a Sequential Scan.
--
-- Reason:
--   The query matched all 400 rows in mess_bills.
--   With such a small table and no filtering selectivity,
--   a sequential scan remained cheaper.
--
-- The index was therefore not retained.


-- ------------------------------------------------------------
-- D. idx_room_allocations_room_vacated
-- ------------------------------------------------------------
--
-- Tested:
--
-- CREATE INDEX idx_room_allocations_room_vacated
-- ON room_allocations(room_id, vacated_on);
--
-- Result:
--   PostgreSQL continued to use a Sequential Scan.
--
-- Reason:
--   room_allocations contains only 400 rows in this project,
--   so scanning the entire table was cheaper than using
--   the additional index.
--
-- The index was therefore not retained.


-- ------------------------------------------------------------
-- E. idx_attendance_student_id
-- ------------------------------------------------------------
--
-- A standalone student_id index was tested during development.
--
-- The table already has the following UNIQUE constraint:
--
--   UNIQUE(student_id, meal_type_id, attendance_date)
--
-- PostgreSQL therefore already maintains a unique composite
-- index whose leading column is student_id.
--
-- For this project, a separate standalone student_id index
-- is unnecessary and is not included in the final design.


-- ============================================================
-- AUTOMATIC / STRUCTURAL INDEXES
-- ============================================================
--
-- The following indexes are created automatically by
-- PRIMARY KEY or UNIQUE constraints and therefore do not
-- need to be recreated here:
--
--   blocks.block_id
--   blocks.block_name
--   rooms.room_id
--   rooms(block_id, room_number)
--   students.student_id
--   students.roll_number
--   students.email
--   room_allocations.allocation_id
--   room_allocations(student_id) WHERE vacated_on IS NULL
--   meal_types.meal_type_id
--   meal_types.meal_name
--   mess_attendance.attendance_id
--   mess_attendance(student_id, meal_type_id, attendance_date)
--   mess_bills.bill_id
--   mess_bills(student_id, billing_month)
--   mess_bill_items.bill_item_id
--   mess_bill_items(bill_id, meal_type_id)
--
-- These indexes serve integrity and constraint enforcement
-- and are part of the database design.


-- ============================================================
-- END OF FINAL INDEX DESIGN
-- ============================================================