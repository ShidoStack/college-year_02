-- ============================================================
-- HOSTEL ROOM ALLOTMENT AND MESS BILLING
-- BUSINESS QUERIES
-- PostgreSQL
-- ============================================================

-- ============================================================
-- QUERY 1
-- Vacant rooms in each block
--
-- Question:
-- How many rooms are vacant in each block?
--
-- A room is considered vacant if it has no active allocation.
-- Active allocation = vacated_on IS NULL
-- ============================================================

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
GROUP BY
    b.block_id,
    b.block_name
ORDER BY
    b.block_name;


-- ============================================================
-- QUERY 2
-- Current mess bill of every student
--
-- Question:
-- What is each student's mess bill this month?
--
-- Billing month used:
-- September 2026
-- ============================================================

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
ORDER BY
    s.student_id;


-- ============================================================
-- QUERY 3
-- Students who skipped more than 10 meals
--
-- Question:
-- Which students skipped more than 10 meals this month?
--
-- A skipped meal is an attendance record where consumed = FALSE.
-- ============================================================

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


-- ============================================================
-- QUERY 4
-- Occupancy rate of each block
--
-- Question:
-- What is the occupancy rate of each block?
--
-- Occupied capacity is calculated from active allocations.
-- ============================================================

SELECT
    b.block_name,
    SUM(r.capacity) AS total_capacity,
    COUNT(ra.student_id) AS occupied_beds,
    ROUND(
        COUNT(ra.student_id) * 100.0
        / NULLIF(SUM(r.capacity), 0),
        2
    ) AS occupancy_rate_percent
FROM blocks b
JOIN rooms r
    ON r.block_id = b.block_id
LEFT JOIN room_allocations ra
    ON ra.room_id = r.room_id
   AND ra.vacated_on IS NULL
GROUP BY
    b.block_id,
    b.block_name
ORDER BY
    occupancy_rate_percent DESC;


-- ============================================================
-- QUERY 5
-- Rooms that were vacated but not re-allotted
--
-- Question:
-- Which rooms were vacated but have not been re-allotted?
--
-- We find rooms with:
-- 1. At least one historical allocation
-- 2. A vacated allocation
-- 3. No current active allocation
-- ============================================================

SELECT
    b.block_name,
    r.room_number,
    MAX(ra.vacated_on) AS last_vacated_on
FROM blocks b
JOIN rooms r
    ON r.block_id = b.block_id
JOIN room_allocations ra
    ON ra.room_id = r.room_id
WHERE ra.vacated_on IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM room_allocations current_ra
      WHERE current_ra.room_id = r.room_id
        AND current_ra.vacated_on IS NULL
  )
GROUP BY
    b.block_id,
    b.block_name,
    r.room_id,
    r.room_number
ORDER BY
    last_vacated_on DESC;


-- ============================================================
-- ADDITIONAL QUERY 6
-- Current students and their room details
--
-- Useful operational query:
-- Which student is currently staying in which room?
-- ============================================================

SELECT
    s.roll_number,
    s.full_name,
    b.block_name,
    r.room_number,
    r.floor_number,
    ra.allocated_from
FROM students s
JOIN room_allocations ra
    ON ra.student_id = s.student_id
JOIN rooms r
    ON r.room_id = ra.room_id
JOIN blocks b
    ON b.block_id = r.block_id
WHERE ra.vacated_on IS NULL
ORDER BY
    b.block_name,
    r.room_number,
    s.roll_number;


-- ============================================================
-- ADDITIONAL QUERY 7
-- Students with unpaid/pending mess bills
-- ============================================================

SELECT
    s.roll_number,
    s.full_name,
    mb.billing_month,
    mb.total_amount,
    mb.status
FROM students s
JOIN mess_bills mb
    ON mb.student_id = s.student_id
WHERE mb.status IN ('Pending', 'Generated')
ORDER BY
    mb.total_amount DESC;


-- ============================================================
-- ADDITIONAL QUERY 8
-- Total mess revenue for September 2026
-- ============================================================

SELECT
    billing_month,
    COUNT(*) AS total_bills,
    SUM(total_amount) AS total_mess_revenue,
    ROUND(AVG(total_amount), 2) AS average_bill
FROM mess_bills
WHERE billing_month = DATE '2026-09-01'
GROUP BY
    billing_month;


-- ============================================================
-- ADDITIONAL QUERY 9
-- Meal consumption summary
--
-- Shows how many times each meal was consumed.
-- ============================================================

SELECT
    mt.meal_name,
    COUNT(*) FILTER (
        WHERE ma.consumed = TRUE
    ) AS meals_consumed,
    COUNT(*) FILTER (
        WHERE ma.consumed = FALSE
    ) AS meals_skipped
FROM meal_types mt
JOIN mess_attendance ma
    ON ma.meal_type_id = mt.meal_type_id
WHERE ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'
GROUP BY
    mt.meal_type_id,
    mt.meal_name
ORDER BY
    mt.meal_type_id;


-- ============================================================
-- ADDITIONAL QUERY 10
-- Students with the highest mess bills
-- ============================================================

SELECT
    s.roll_number,
    s.full_name,
    mb.total_amount,
    mb.status
FROM students s
JOIN mess_bills mb
    ON mb.student_id = s.student_id
WHERE mb.billing_month = DATE '2026-09-01'
ORDER BY
    mb.total_amount DESC
LIMIT 10;