-- Create the people table
CREATE TABLE people (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on CPF for faster lookups
CREATE INDEX idx_people_cpf ON people(cpf);

-- Enable Row Level Security (RLS)
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON people
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create a policy that allows read-only access for anonymous users
CREATE POLICY "Allow read-only access for anonymous users" ON people
    FOR SELECT
    TO anon
    USING (true);
