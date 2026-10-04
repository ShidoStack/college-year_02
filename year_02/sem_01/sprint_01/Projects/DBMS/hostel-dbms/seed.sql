-- ============================================================
-- HOSTEL ROOM ALLOTMENT AND MESS BILLING
-- SEED DATA
-- PostgreSQL
-- ============================================================


-- 1. BLOCKS


INSERT INTO blocks (
    block_name,
    description
)
VALUES
    ('A Block', 'Main residential block'),
    ('B Block', 'North residential block'),
    ('C Block', 'South residential block'),
    ('D Block', 'East residential block'),
    ('E Block', 'West residential block'),
    ('F Block', 'Senior student block'),
    ('G Block', 'Postgraduate block'),
    ('H Block', 'New residential block');



-- 2. ROOMS
-- 8 blocks × 30 rooms = 240 rooms


INSERT INTO rooms (
    block_id,
    room_number,
    capacity,
    floor_number
)
SELECT
    b.block_id,

    LPAD(r.room_no::TEXT, 3, '0'),

    CASE
        WHEN r.room_no % 10 = 0 THEN 6
        ELSE 4
    END,

    ((r.room_no - 1) / 10) + 1

FROM blocks b

CROSS JOIN generate_series(1, 30) AS r(room_no);



-- 3. STUDENTS
-- 400 students


INSERT INTO students (
    roll_number,
    full_name,
    gender,
    course,
    year_of_study,
    phone,
    email,
    admission_date
)
SELECT
    'STU' || LPAD(gs::TEXT, 4, '0'),

    'Student ' || gs,

    CASE
        WHEN gs % 2 = 0 THEN 'Male'
        ELSE 'Female'
    END,

    CASE
        WHEN gs % 5 = 0 THEN 'Computer Science'
        WHEN gs % 5 = 1 THEN 'Information Technology'
        WHEN gs % 5 = 2 THEN 'Mechanical Engineering'
        WHEN gs % 5 = 3 THEN 'Civil Engineering'
        ELSE 'Electronics Engineering'
    END,

    ((gs - 1) % 4) + 1,

    '90000' || LPAD(gs::TEXT, 5, '0'),

    'student' || gs || '@college.edu',

    DATE '2023-06-01'
        + ((gs * 7) % 900)

FROM generate_series(1, 400) AS gs;



-- 4. MEAL TYPES


INSERT INTO meal_types (
    meal_name,
    rate
)
VALUES
    ('Breakfast', 30.00),
    ('Lunch', 50.00),
    ('Dinner', 60.00);



-- 5. HISTORICAL ROOM ALLOCATIONS
--
-- 100 students have previous allocations.
-- These rooms are now available again.


INSERT INTO room_allocations (
    room_id,
    student_id,
    allocated_from,
    vacated_on,
    allocation_reason
)
SELECT
    ((gs - 1) % 240) + 1,

    gs,

    DATE '2025-07-01'
        + ((gs * 3) % 30),

    DATE '2026-06-01'
        + ((gs * 2) % 30),

    'Previous academic year allocation'

FROM generate_series(1, 100) AS gs;



-- 6. CURRENT ROOM ALLOCATIONS
--
-- Students 101–400 = 300 current allocations.
--
-- Each room has maximum 4 students in this seed data.
-- This deliberately leaves some vacant capacity.


INSERT INTO room_allocations (
    room_id,
    student_id,
    allocated_from,
    vacated_on,
    allocation_reason
)
SELECT
    ((gs - 101) / 4) + 1,

    gs,

    DATE '2026-07-01'
        + ((gs * 3) % 15),

    NULL,

    'Current academic year allocation'

FROM generate_series(101, 400) AS gs;



-- 7. MESS ATTENDANCE
--
-- 400 students
-- × 30 days
-- × 3 meals
-- = 36,000 attendance records
--
-- Approximately 8% of meals are skipped.


INSERT INTO mess_attendance (
    student_id,
    meal_type_id,
    attendance_date,
    consumed
)
SELECT
    s.student_id,
    m.meal_type_id,
    d.attendance_date,

    CASE
        -- Students 1–20 intentionally skip more than 10 meals
        -- so Query 3 has meaningful results.
        WHEN s.student_id BETWEEN 1 AND 20
             AND d.attendance_date < DATE '2026-09-05'
        THEN FALSE

        -- Normal attendance pattern: approximately 8% skipped.
        WHEN (
            (s.student_id * 31)
            + (EXTRACT(
                DAY FROM d.attendance_date
            )::INTEGER * 17)
            + (m.meal_type_id * 13)
        ) % 100 < 8
        THEN FALSE

        ELSE TRUE
    END

FROM generate_series(
    DATE '2026-09-01',
    DATE '2026-09-30',
    INTERVAL '1 day'
) AS d(attendance_date)

CROSS JOIN (
    SELECT student_id
    FROM students
) AS s

CROSS JOIN meal_types AS m;




-- 8. SEPTEMBER 2026 MESS BILLS


INSERT INTO mess_bills (
    student_id,
    billing_month,
    total_amount,
    status
)
SELECT
    ma.student_id,

    DATE '2026-09-01',

    SUM(
        CASE
            WHEN ma.consumed = TRUE
            THEN mt.rate
            ELSE 0
        END
    ),

    CASE
        WHEN ma.student_id % 5 = 0
            THEN 'Paid'

        WHEN ma.student_id % 3 = 0
            THEN 'Pending'

        ELSE 'Generated'
    END

FROM mess_attendance AS ma

JOIN meal_types AS mt
    ON mt.meal_type_id = ma.meal_type_id

WHERE ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'

GROUP BY
    ma.student_id;



-- 9. MESS BILL ITEMS
-- Approximately:
-- 400 students × 3 meal types = 1,200 items


INSERT INTO mess_bill_items (
    bill_id,
    meal_type_id,
    meals_consumed,
    rate_per_meal,
    amount
)
SELECT
    mb.bill_id,

    ma.meal_type_id,

    COUNT(*) FILTER (
        WHERE ma.consumed = TRUE
    ) AS meals_consumed,

    mt.rate,

    COUNT(*) FILTER (
        WHERE ma.consumed = TRUE
    ) * mt.rate AS amount

FROM mess_bills AS mb

JOIN mess_attendance AS ma
    ON ma.student_id = mb.student_id

JOIN meal_types AS mt
    ON mt.meal_type_id = ma.meal_type_id

WHERE mb.billing_month = DATE '2026-09-01'

  AND ma.attendance_date >= DATE '2026-09-01'
  AND ma.attendance_date < DATE '2026-10-01'

GROUP BY
    mb.bill_id,
    ma.meal_type_id,
    mt.rate;



-- 10. UPDATE STATISTICS


ANALYZE;



-- 11. VERIFICATION


SELECT
    'blocks' AS table_name,
    COUNT(*) AS record_count
FROM blocks

UNION ALL

SELECT
    'rooms',
    COUNT(*)
FROM rooms

UNION ALL

SELECT
    'students',
    COUNT(*)
FROM students

UNION ALL

SELECT
    'room_allocations',
    COUNT(*)
FROM room_allocations

UNION ALL

SELECT
    'meal_types',
    COUNT(*)
FROM meal_types

UNION ALL

SELECT
    'mess_attendance',
    COUNT(*)
FROM mess_attendance

UNION ALL

SELECT
    'mess_bills',
    COUNT(*)
FROM mess_bills

UNION ALL

SELECT
    'mess_bill_items',
    COUNT(*)
FROM mess_bill_items

ORDER BY table_name;