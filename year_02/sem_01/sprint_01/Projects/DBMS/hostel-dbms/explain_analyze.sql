-- ============================================================
-- HOSTEL ROOM ALLOTMENT AND MESS BILLING
-- EXPLAIN ANALYZE AND INDEX EXPERIMENTS
-- PostgreSQL
-- ============================================================
--
-- Purpose:
--   Demonstrate PostgreSQL query execution plans and evaluate
--   the effect of indexes on query performance.
--
-- Important:
--   The before/after execution plans were captured separately
--   during the project using EXPLAIN (ANALYZE, BUFFERS).
--
--   Screenshots are stored in:
--     screenshots/query1_before.png
--     screenshots/query1_after.png
--     screenshots/query2_before.png
--     screenshots/query2_after.png
--     screenshots/query3_before.png
--     screenshots/query3_after.png
--     screenshots/query4_before.png
--     screenshots/query4_after.png
--     screenshots/query5_before.png
--     screenshots/query5_after.png
--
-- ============================================================


-- ============================================================
-- EXPERIMENT 1
-- Students who skipped more than 10 meals
-- ============================================================
--
-- Purpose:
--   Test whether an index on (attendance_date, consumed)
--   improves a moderately selective attendance query.
--
-- ------------------------------------------------------------
-- BEFORE INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    COUNT(*) AS meals_skipped
FROM students s
JOIN mess_attendance ma
    ON ma.student_id = s.student_id
WHERE ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'
  AND ma.consumed = FALSE
GROUP BY
    s.student_id,
    s.roll_number,
    s.full_name
HAVING COUNT(*) > 10
ORDER BY
    meals_skipped DESC,
    s.student_id;


-- Result:
--   Sequential Scan on mess_attendance
--   3,100 rows matched
--   32,900 rows removed by filter
--   Execution Time: 4.463 ms


-- ------------------------------------------------------------
-- CREATE TEST INDEX
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_mess_attendance_date_consumed
ON mess_attendance(attendance_date, consumed);

ANALYZE mess_attendance;


-- ------------------------------------------------------------
-- AFTER INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    COUNT(*) AS meals_skipped
FROM students s
JOIN mess_attendance ma
    ON ma.student_id = s.student_id
WHERE ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'
  AND ma.consumed = FALSE
GROUP BY
    s.student_id,
    s.roll_number,
    s.full_name
HAVING COUNT(*) > 10
ORDER BY
    meals_skipped DESC,
    s.student_id;


-- Result:
--   Bitmap Index Scan + Bitmap Heap Scan
--   3,100 rows matched
--   Execution Time: 5.695 ms
--
-- Observation:
--   The index made this query slower.
--
--   Before: 4.463 ms
--   After:  5.695 ms
--
--   PostgreSQL used the index, but the additional cost of
--   index traversal and heap access was greater than the cost
--   of scanning the relatively small 36,000-row table.
--
--   This provides the required example showing that an index
--   does not automatically improve every query.


DROP INDEX IF EXISTS idx_mess_attendance_date_consumed;

ANALYZE mess_attendance;


-- ============================================================
-- EXPERIMENT 2
-- Student mess bills for September 2026
-- ============================================================
--
-- Purpose:
--   Test whether indexing billing_month is useful when the
--   query matches the entire mess_bills table.
--
-- ------------------------------------------------------------
-- BEFORE INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    mb.billing_month,
    mb.total_amount,
    mb.status
FROM students s
JOIN mess_bills mb
    ON mb.student_id = s.student_id
WHERE mb.billing_month = DATE '2026-09-01'
ORDER BY s.student_id;


-- Result:
--   Sequential Scan on mess_bills
--   All 400 rows matched
--   Execution Time: 1.571 ms


-- ------------------------------------------------------------
-- CREATE TEST INDEX
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_mess_bills_billing_month
ON mess_bills(billing_month);

ANALYZE mess_bills;


-- ------------------------------------------------------------
-- AFTER INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    mb.billing_month,
    mb.total_amount,
    mb.status
FROM students s
JOIN mess_bills mb
    ON mb.student_id = s.student_id
WHERE mb.billing_month = DATE '2026-09-01'
ORDER BY s.student_id;


-- Result:
--   PostgreSQL continued using a Sequential Scan.
--
--   Execution Time: 0.793 ms
--
-- Observation:
--   The index was not selected because the query matched all
--   400 rows in the table.
--
--   The lower measured time after the index should not be
--   interpreted as an index improvement because the execution
--   plan remained a Sequential Scan. Runtime variation and
--   caching can affect small queries.
--
--   The index was therefore not retained.

DROP INDEX IF EXISTS idx_mess_bills_billing_month;

ANALYZE mess_bills;


-- ============================================================
-- EXPERIMENT 3
-- Composite index column order
-- ============================================================
--
-- Purpose:
--   Demonstrate why column order matters in a composite index.
--
-- The query filters by attendance_date and consumed, but the
-- tested index begins with student_id.
--
-- ------------------------------------------------------------
-- BEFORE INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    COUNT(*) AS meals_skipped
FROM students s
JOIN mess_attendance ma
    ON ma.student_id = s.student_id
WHERE ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'
  AND ma.consumed = FALSE
GROUP BY
    s.student_id,
    s.roll_number,
    s.full_name
HAVING COUNT(*) > 10
ORDER BY
    meals_skipped DESC,
    s.student_id;


-- Result:
--   Sequential Scan on mess_attendance
--   Execution Time: 4.757 ms


-- ------------------------------------------------------------
-- CREATE TEST COMPOSITE INDEX
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_mess_attendance_student_date_consumed
ON mess_attendance(student_id, attendance_date, consumed);

ANALYZE mess_attendance;


-- ------------------------------------------------------------
-- AFTER INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    s.student_id,
    s.roll_number,
    s.full_name,
    COUNT(*) AS meals_skipped
FROM students s
JOIN mess_attendance ma
    ON ma.student_id = s.student_id
WHERE ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'
  AND ma.consumed = FALSE
GROUP BY
    s.student_id,
    s.roll_number,
    s.full_name
HAVING COUNT(*) > 10
ORDER BY
    meals_skipped DESC,
    s.student_id;


-- Result:
--   PostgreSQL continued using a Sequential Scan.
--   Execution Time: 7.045 ms
--
-- Observation:
--   The index was not used.
--
--   The first column of the index is student_id, but the query
--   does not restrict student_id before filtering attendance_date
--   and consumed.
--
--   This demonstrates the importance of leading-column order
--   in composite indexes.
--
--   The higher execution time should not be described as an
--   index-caused slowdown because the execution plan remained
--   a Sequential Scan.

DROP INDEX IF EXISTS idx_mess_attendance_student_date_consumed;

ANALYZE mess_attendance;


-- ============================================================
-- EXPERIMENT 4
-- Vacant rooms by block
-- ============================================================
--
-- Purpose:
--   Test whether an index on (room_id, vacated_on) improves
--   the room vacancy query.
--
-- ------------------------------------------------------------
-- BEFORE INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    b.block_name,
    COUNT(r.room_id) AS total_rooms,
    COUNT(r.room_id) FILTER (
        WHERE NOT EXISTS (
            SELECT 1
            FROM room_allocations ra
            WHERE ra.room_id = r.room_id
              AND ra.vacated_on IS NULL
        )
    ) AS vacant_rooms
FROM blocks b
JOIN rooms r
    ON r.block_id = b.block_id
GROUP BY b.block_id, b.block_name
ORDER BY b.block_name;


-- Result:
--   Sequential Scan on room_allocations
--   300 active allocation rows
--   100 rows removed by the vacated_on filter
--   Execution Time: 1.226 ms


-- ------------------------------------------------------------
-- CREATE TEST INDEX
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_room_allocations_room_vacated
ON room_allocations(room_id, vacated_on);

ANALYZE room_allocations;


-- ------------------------------------------------------------
-- AFTER INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    b.block_name,
    COUNT(r.room_id) AS total_rooms,
    COUNT(r.room_id) FILTER (
        WHERE NOT EXISTS (
            SELECT 1
            FROM room_allocations ra
            WHERE ra.room_id = r.room_id
              AND ra.vacated_on IS NULL
        )
    ) AS vacant_rooms
FROM blocks b
JOIN rooms r
    ON r.block_id = b.block_id
GROUP BY b.block_id, b.block_name
ORDER BY b.block_name;


-- Result:
--   PostgreSQL continued using a Sequential Scan.
--   Execution Time: 0.635 ms
--
-- Observation:
--   The index was not selected because room_allocations
--   contains only 400 rows.
--
--   For such a small table, PostgreSQL determined that scanning
--   the table was cheaper than using the additional index.
--
--   The lower execution time should not be interpreted as an
--   index improvement because the plan remained a Sequential
--   Scan and small-query timings are affected by caching and
--   runtime variation.

DROP INDEX IF EXISTS idx_room_allocations_room_vacated;

ANALYZE room_allocations;


-- ============================================================
-- EXPERIMENT 5
-- Attendance records for a specific date
-- ============================================================
--
-- Purpose:
--   Demonstrate a successful index optimization.
--
-- Query:
--   Count consumed and skipped meals for one attendance date.
--
-- ------------------------------------------------------------
-- BEFORE INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    ma.attendance_date,
    COUNT(*) AS total_records,
    COUNT(*) FILTER (
        WHERE ma.consumed = TRUE
    ) AS meals_consumed,
    COUNT(*) FILTER (
        WHERE ma.consumed = FALSE
    ) AS meals_skipped
FROM mess_attendance ma
WHERE ma.attendance_date = DATE '2026-09-15'
GROUP BY ma.attendance_date;


-- Result:
--   Sequential Scan on mess_attendance
--   1,200 rows matched
--   34,800 rows removed by filter
--   Buffers: 300 shared hits
--   Execution Time: 3.937 ms


-- ------------------------------------------------------------
-- CREATE INDEX
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_attendance_date
ON mess_attendance(attendance_date);

ANALYZE mess_attendance;


-- ------------------------------------------------------------
-- AFTER INDEX
-- ------------------------------------------------------------

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    ma.attendance_date,
    COUNT(*) AS total_records,
    COUNT(*) FILTER (
        WHERE ma.consumed = TRUE
    ) AS meals_consumed,
    COUNT(*) FILTER (
        WHERE ma.consumed = FALSE
    ) AS meals_skipped
FROM mess_attendance ma
WHERE ma.attendance_date = DATE '2026-09-15'
GROUP BY ma.attendance_date;


-- Result:
--   Index Scan using idx_attendance_date
--   1,200 rows matched
--   Buffers: 13 shared hits/reads
--   Execution Time: 0.372 ms
--
-- Observation:
--   The index significantly improved the query.
--
--   Before: 3.937 ms
--   After:  0.372 ms
--
--   Approximate speed-up: 10.6x
--
--   The execution plan changed from a Sequential Scan to an
--   Index Scan.
--
--   The number of buffer accesses also decreased substantially.
--
--   This demonstrates that an index is particularly useful when
--   the query is selective enough to avoid scanning most of
--   the table.


-- ============================================================
-- FINAL CLEANUP
-- ============================================================
--
-- Keep idx_attendance_date because it is part of the final
-- index design.
--
-- Remove temporary experiment indexes if they still exist.

DROP INDEX IF EXISTS idx_mess_attendance_date_consumed;
DROP INDEX IF EXISTS idx_mess_attendance_student_date_consumed;
DROP INDEX IF EXISTS idx_mess_bills_billing_month;
DROP INDEX IF EXISTS idx_room_allocations_room_vacated;

ANALYZE;


-- ============================================================
-- FINAL INDEX DESIGN SUMMARY
-- ============================================================
--
-- Retained performance indexes:
--
--   idx_attendance_date
--   idx_attendance_meal_type_id
--   idx_allocations_room_id
--   idx_allocations_student_id
--   idx_bills_student_id
--
-- Rejected/test-only indexes:
--
--   idx_mess_attendance_date_consumed
--   idx_mess_attendance_student_date_consumed
--   idx_mess_bills_billing_month
--   idx_room_allocations_room_vacated
--
-- Key conclusions:
--
-- 1. Indexes can improve selective queries significantly.
--
-- 2. Indexes can make some queries slower when the table is
--    small or the filter is not selective.
--
-- 3. PostgreSQL may ignore an index when a Sequential Scan is
--    estimated to be cheaper.
--
-- 4. Composite index column order matters.
--
-- 5. Indexes have a maintenance cost for INSERT, UPDATE and
--    DELETE operations, so unnecessary indexes should be avoided.
--
-- ============================================================