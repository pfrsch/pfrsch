export const schema = `
-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    about_html TEXT,
    theme JSONB DEFAULT '{"primaryColor":"#0066ff", "secondaryColor":"#f2f2f2", "fontFamily":"Roboto"}',
    custom_domain VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users/Auth table (for login)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    company_id INT REFERENCES companies(id),
    employee_id INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employee applications (pending approval)
CREATE TABLE IF NOT EXISTS employee_applications (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    photo_url TEXT,
    bio TEXT,
    tag_ids INT[],
    submitted_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    reviewed_by INT REFERENCES users(id),
    reviewed_at TIMESTAMP
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    user_id INT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    bio TEXT,
    hourly_rate NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tags (specialties/skills)
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employee-Tag relationship (many-to-many)
CREATE TABLE IF NOT EXISTS employee_tags (
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (employee_id, tag_id)
);

-- Employee availability (recurring weekly schedule)
CREATE TABLE IF NOT EXISTS employee_availability (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    weekday SMALLINT CHECK (weekday BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments/Service requests
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(30),
    start_timestamp TIMESTAMP NOT NULL,
    end_timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(id),
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employee_tags_employee ON employee_tags(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_tags_tag ON employee_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_appointments_employee ON appointments(employee_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(start_timestamp);
CREATE INDEX IF NOT EXISTS idx_employee_availability_employee ON employee_availability(employee_id);
`;

export default schema;
