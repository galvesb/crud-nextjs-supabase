-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON people;
DROP POLICY IF EXISTS "Allow read-only access for anonymous users" ON people;

-- Create a new policy that allows all operations for everyone
CREATE POLICY "Allow all operations for all users" ON people
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
