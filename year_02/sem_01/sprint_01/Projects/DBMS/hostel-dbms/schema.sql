-- ============================================================
-- HOSTEL ROOM ALLOTMENT AND MESS BILLING
-- Database Management System Project
-- PostgreSQL
-- ============================================================

-- Clean existing schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;


-- 1. BLOCKS


CREATE TABLE blocks (
    block_id BIGSERIAL PRIMARY KEY,

    block_name VARCHAR(50) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);



-- 2. ROOMS


CREATE TABLE rooms (
    room_id BIGSERIAL PRIMARY KEY,

    block_id BIGINT NOT NULL,

    room_number VARCHAR(20) NOT NULL,

    capacity INTEGER NOT NULL DEFAULT 4,

    floor_number INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rooms_block
        FOREIGN KEY (block_id)
        REFERENCES blocks(block_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_room_capacity
        CHECK (capacity > 0),

    CONSTRAINT chk_room_floor
        CHECK (floor_number > 0),

    CONSTRAINT uq_room_block_number
        UNIQUE (block_id, room_number)
);



-- 3. STUDENTS


CREATE TABLE students (
    student_id BIGSERIAL PRIMARY KEY,

    roll_number VARCHAR(30) NOT NULL UNIQUE,

    full_name VARCHAR(100) NOT NULL,

    gender VARCHAR(20) NOT NULL,

    course VARCHAR(100) NOT NULL,

    year_of_study INTEGER NOT NULL,

    phone VARCHAR(20),

    email VARCHAR(150),

    admission_date DATE NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_student_year
        CHECK (year_of_study BETWEEN 1 AND 6),

    CONSTRAINT chk_student_gender
        CHECK (gender IN ('Male', 'Female', 'Other')),

    CONSTRAINT uq_student_email
        UNIQUE (email)
);



-- 4. ROOM ALLOCATIONS


CREATE TABLE room_allocations (
    allocation_id BIGSERIAL PRIMARY KEY,

    room_id BIGINT NOT NULL,

    student_id BIGINT NOT NULL,

    allocated_from DATE NOT NULL,

    vacated_on DATE,

    allocation_reason VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_allocation_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(room_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_allocation_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_allocation_dates
        CHECK (
            vacated_on IS NULL
            OR vacated_on >= allocated_from
        )
);



-- Only one active room allocation per student


CREATE UNIQUE INDEX uq_active_student_allocation
ON room_allocations(student_id)
WHERE vacated_on IS NULL;



-- 5. MEAL TYPES


CREATE TABLE meal_types (
    meal_type_id SMALLSERIAL PRIMARY KEY,

    meal_name VARCHAR(30) NOT NULL UNIQUE,

    rate NUMERIC(10,2) NOT NULL,

    CONSTRAINT chk_meal_rate
        CHECK (rate >= 0)
);



-- 6. MESS ATTENDANCE


CREATE TABLE mess_attendance (
    attendance_id BIGSERIAL PRIMARY KEY,

    student_id BIGINT NOT NULL,

    meal_type_id SMALLINT NOT NULL,

    attendance_date DATE NOT NULL,

    consumed BOOLEAN NOT NULL DEFAULT TRUE,

    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_attendance_meal
        FOREIGN KEY (meal_type_id)
        REFERENCES meal_types(meal_type_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_student_meal_date
        UNIQUE (
            student_id,
            meal_type_id,
            attendance_date
        )
);



-- 7. MONTHLY MESS BILLS


CREATE TABLE mess_bills (
    bill_id BIGSERIAL PRIMARY KEY,

    student_id BIGINT NOT NULL,

    billing_month DATE NOT NULL,

    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'Generated',

    CONSTRAINT fk_bill_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_student_billing_month
        UNIQUE (
            student_id,
            billing_month
        ),

    CONSTRAINT chk_bill_amount
        CHECK (total_amount >= 0),

    CONSTRAINT chk_bill_status
        CHECK (
            status IN ('Generated', 'Paid', 'Pending')
        )
);



-- 8. MESS BILL ITEMS


CREATE TABLE mess_bill_items (
    bill_item_id BIGSERIAL PRIMARY KEY,

    bill_id BIGINT NOT NULL,

    meal_type_id SMALLINT NOT NULL,

    meals_consumed INTEGER NOT NULL,

    rate_per_meal NUMERIC(10,2) NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    CONSTRAINT fk_bill_item_bill
        FOREIGN KEY (bill_id)
        REFERENCES mess_bills(bill_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bill_item_meal
        FOREIGN KEY (meal_type_id)
        REFERENCES meal_types(meal_type_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_meals_consumed
        CHECK (meals_consumed >= 0),

    CONSTRAINT chk_rate
        CHECK (rate_per_meal >= 0),

    CONSTRAINT chk_bill_item_amount
        CHECK (amount >= 0),

    CONSTRAINT uq_bill_meal
        UNIQUE (
            bill_id,
            meal_type_id
        )
);



-- ============================================================
-- Performance indexes
-- ============================================================
--
-- Performance-oriented indexes are created separately in
-- indexes.sql so that index design and EXPLAIN ANALYZE
-- experiments can be demonstrated independently.
--
-- Primary-key and UNIQUE constraint indexes are created
-- automatically by PostgreSQL and remain part of the schema.
--
-- The partial unique index below is intentionally kept here
-- because it enforces a business rule:
-- a student can have only one active room allocation.
-- ============================================================





-- Verify tables


\dt