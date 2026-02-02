-- =====================================================
-- Add Invite Code Auto-Generation Trigger
-- =====================================================
-- This trigger automatically generates a 6-character
-- invite code when a new household is created
-- =====================================================

-- Create trigger function to auto-generate invite code
CREATE OR REPLACE FUNCTION auto_generate_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if invite_code is not already set
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_unique_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on households table
DROP TRIGGER IF EXISTS trigger_auto_generate_invite_code ON households;
CREATE TRIGGER trigger_auto_generate_invite_code
  BEFORE INSERT ON households
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_invite_code();

-- =====================================================
-- Optional: Update existing households without codes
-- =====================================================
-- If you have existing households without proper codes,
-- uncomment and run this to fix them:

-- UPDATE households
-- SET invite_code = generate_unique_invite_code()
-- WHERE invite_code IS NULL
--    OR LENGTH(invite_code) != 6
--    OR invite_code ~ '[^A-Z0-9]';
