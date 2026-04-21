-- schema.sql for WeddingBudget.ai

-- 1. images
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) NOT NULL,
    source_id VARCHAR(100),
    cloudinary_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    search_query VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. labels (admin-assigned training labels)
CREATE TABLE IF NOT EXISTS labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    function_type VARCHAR(100) NOT NULL,
    style VARCHAR(100) NOT NULL,
    complexity_tier INTEGER CHECK (complexity_tier BETWEEN 1 AND 5),
    cost_seed_low NUMERIC(15, 2) NOT NULL,
    cost_seed_mid NUMERIC(15, 2) NOT NULL,
    cost_seed_high NUMERIC(15, 2) NOT NULL,
    confidence NUMERIC(3, 2) DEFAULT 1.0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. artists (entertainment cost database)
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255), -- Nullable for generic tiers
    tier INTEGER CHECK (tier BETWEEN 1 AND 4),
    category VARCHAR(100) NOT NULL,
    fee_low NUMERIC(15, 2) NOT NULL,
    fee_high NUMERIC(15, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. logistics_rules
CREATE TABLE IF NOT EXISTS logistics_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guests_per_innova INTEGER NOT NULL,
    innova_cost_per_km_min NUMERIC(15, 2) NOT NULL,
    innova_cost_per_km_max NUMERIC(15, 2) NOT NULL,
    driver_allowance_per_day NUMERIC(15, 2) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default logistics rules
INSERT INTO logistics_rules (guests_per_innova, innova_cost_per_km_min, innova_cost_per_km_max, driver_allowance_per_day) 
VALUES (3, 15.00, 25.00, 500.00) ON CONFLICT DO NOTHING;

-- 5. ceremonial_costs
CREATE TABLE IF NOT EXISTS ceremonial_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL,
    item_type VARCHAR(100) NOT NULL, -- Ghodi, Dholi, SFX
    unit VARCHAR(50) NOT NULL,
    cost_low NUMERIC(15, 2) NOT NULL,
    cost_high NUMERIC(15, 2) NOT NULL,
    UNIQUE(city, item_type)
);

-- 6. fnb_rates
CREATE TABLE IF NOT EXISTS fnb_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_type VARCHAR(100) NOT NULL,
    venue_tier VARCHAR(100) NOT NULL,
    cost_per_head_low NUMERIC(15, 2) NOT NULL,
    cost_per_head_high NUMERIC(15, 2) NOT NULL,
    UNIQUE(meal_type, venue_tier)
);

-- 7. bar_rates
CREATE TABLE IF NOT EXISTS bar_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bar_type VARCHAR(100) NOT NULL,
    venue_tier VARCHAR(100) NOT NULL,
    cost_per_head_low NUMERIC(15, 2) NOT NULL,
    cost_per_head_high NUMERIC(15, 2) NOT NULL,
    UNIQUE(bar_type, venue_tier)
);

-- 8. sundries_config
CREATE TABLE IF NOT EXISTS sundries_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_key VARCHAR(100) NOT NULL,
    hotel_tier VARCHAR(100), -- Nullable
    unit VARCHAR(50) NOT NULL,
    cost_low NUMERIC(15, 2) NOT NULL,
    cost_high NUMERIC(15, 2) NOT NULL,
    UNIQUE(item_key, hotel_tier)
);

-- 9. budget_sessions (saved user sessions)
CREATE TABLE IF NOT EXISTS budget_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token UUID UNIQUE DEFAULT gen_random_uuid(),
    input_params JSONB NOT NULL,
    selected_images JSONB,
    budget_output JSONB,
    actuals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
