import { Pool } from "pg";
import bcrypt from "bcrypt";

/**
 * 🔍 Test database connection and list existing tables
 */
export const testDbDetails = async (req, res) => {
    try {
        const { host, port, db, user, password } = req.body;

        if (!host || !port || !db || !user || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Missing DB credentials" });
        }

        const pool = new Pool({ host, port, database: db, user, password });
        await pool.query("SELECT NOW()");

        const tablesResult = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        `);

        res.json({
            success: true,
            message: "✅ Database connection successful",
            tables: tablesResult.rows.map((r) => r.table_name),
        });

        await pool.end();
    } catch (error) {
        console.error("DB Test Error:", error);
        res.status(500).json({
            success: false,
            message: "❌ DB connection failed",
            error: error.message,
        });
    }
};

/**
 * ⚙️ Run Installation: create tables + seed admin user
 */
export const runInstallation = async (req, res) => {
    const { host, port, database, user, password, admin } = req.body;

    if (!host || !port || !database || !user || !password || !admin) {
        return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
    }

    const pool = new Pool({ host, port, database, user, password });
    const client = await pool.connect();

    try {
        console.log("🔧 Starting installation...");

        // ======================
        // CREATE BASE TABLES
        // ======================
        console.log("📦 Creating base tables...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL,
                display_name VARCHAR(100) NOT NULL,
                description TEXT,
                is_system BOOLEAN DEFAULT false,
                permissions JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
                status VARCHAR DEFAULT 'active',
                profile_image_url VARCHAR,
                created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS user_permissions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                module VARCHAR NOT NULL,
                enabled BOOLEAN DEFAULT false,
                can_read BOOLEAN DEFAULT false,
                can_write BOOLEAN DEFAULT false,
                can_delete BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now(),
                UNIQUE (user_id, module)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS activities (
                id SERIAL PRIMARY KEY,
                type VARCHAR NOT NULL,
                description TEXT NOT NULL,
                entity_type VARCHAR,
                entity_id VARCHAR,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                created_by INTEGER NOT NULL REFERENCES users(id)
            );
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
            CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by);
            CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
        `);


        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                                                      id SERIAL PRIMARY KEY,
                                                      name VARCHAR(100) NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                                                 id SERIAL PRIMARY KEY,
                                                 title VARCHAR(255) NOT NULL,
                                                 slug VARCHAR(255) NOT NULL UNIQUE,
                                                 excerpt TEXT,
                                                 content TEXT NOT NULL,
                                                 status VARCHAR(20) DEFAULT 'draft',
                                                 created_at TIMESTAMP DEFAULT NOW(),
                                                 updated_at TIMESTAMP DEFAULT NOW(),
                                                 cover_image TEXT,
                                                 description TEXT,
                                                 tags VARCHAR(255),
                                                 meta_title VARCHAR(255),
                                                 meta_keywords TEXT,
                                                 meta_description TEXT,
                                                 category_id INTEGER REFERENCES categories(id)
            );
        `);

        await client.query(`
    CREATE TABLE IF NOT EXISTS consultation_requests (
        id SERIAL PRIMARY KEY,
        
        -- Contact Information
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(255),
        job_title VARCHAR(100),
        
        -- Business Information
        business_type VARCHAR(100),
        industry VARCHAR(100),
        business_size VARCHAR(50),
        annual_revenue VARCHAR(100),
        
        -- Consultation Details
        consultation_type VARCHAR(100) NOT NULL,
        preferred_date TIMESTAMP,
        preferred_time VARCHAR(50),
        timezone VARCHAR(50),
        
        -- Project Information
        project_description TEXT,
        main_challenges TEXT,
        goals TEXT,
        budget_range VARCHAR(100),
        timeline VARCHAR(100),
        
        -- How did you hear about us
        referral_source VARCHAR(100),
        referral_details TEXT,
        
        -- Additional Information
        additional_info TEXT,
        hear_about_us TEXT,
        
        -- Status & Metadata
        status VARCHAR(50) DEFAULT 'pending',
        is_followed_up BOOLEAN DEFAULT false,
        notes TEXT,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`);

// Create indexes
        await client.query(`
    CREATE INDEX IF NOT EXISTS idx_consultation_requests_email 
    ON consultation_requests(email);
`);

        await client.query(`
    CREATE INDEX IF NOT EXISTS idx_consultation_requests_status 
    ON consultation_requests(status);
`);

        await client.query(`
    CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at 
    ON consultation_requests(created_at DESC);
`);

        // Create tables first
        await client.query(`
            CREATE TABLE IF NOT EXISTS gallery_categories (
                                                              id SERIAL PRIMARY KEY,
                                                              name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                );
        `);

        await client.query(`
    CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        thumbnail_url VARCHAR(500),
        image_urls TEXT,
        category_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_gallery_items_category
            FOREIGN KEY (category_id) 
            REFERENCES gallery_categories(id)
            ON DELETE SET NULL
    );
`);

// Then insert the social category - ONLY specify columns you're providing values for
        await client.query(`
    INSERT INTO gallery_categories (name, description)
    VALUES ('social', 'Social events and gatherings')
    ON CONFLICT (name) DO NOTHING;
`);

        // ======================
        // CHECK IF ADMIN ROLE EXISTS
        // ======================
        console.log("👤 Checking/creating admin role and user...");

        // Check if admin role already exists
        const roleCheck = await client.query(
            `SELECT id FROM roles WHERE name = 'admin' LIMIT 1;`
        );

        let adminRoleId;

        if (roleCheck.rows.length === 0) {
            // Create admin role if it doesn't exist
            const roleResult = await client.query(`
                INSERT INTO roles (name, display_name, description, is_system)
                VALUES ('admin', 'Administrator', 'Full access', true)
                RETURNING id;
            `);
            adminRoleId = roleResult.rows[0].id;
            console.log("✅ Admin role created");
        } else {
            adminRoleId = roleCheck.rows[0].id;
            console.log("ℹ️ Admin role already exists");
        }

        // ======================
        // CHECK IF ADMIN USER EXISTS
        // ======================
        const userCheck = await client.query(
            `SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1;`,
            [admin.username, admin.email]
        );

        let adminUserId;

        if (userCheck.rows.length === 0) {
            // Create admin user if it doesn't exist
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const adminUser = await client.query(
                `
                    INSERT INTO users (username, email, password, role_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id;
                `,
                [admin.username, admin.email, hashedPassword, adminRoleId]
            );
            adminUserId = adminUser.rows[0].id;

            // Create admin permissions
            const modules = ["users", "roles"];
            for (const module of modules) {
                await client.query(
                    `
                        INSERT INTO user_permissions (user_id, module, enabled, can_read, can_write, can_delete)
                        VALUES ($1, $2, true, true, true, true)
                        ON CONFLICT (user_id, module) DO NOTHING;
                    `,
                    [adminUserId, module]
                );
            }
            console.log("✅ Admin user created with permissions");
        } else {
            adminUserId = userCheck.rows[0].id;
            console.log("ℹ️ Admin user already exists");
        }

        console.log("✅ Installation completed successfully");
        res.json({
            success: true,
            message: "✅ Installation completed successfully",
            adminId: adminUserId,
            note: "Tables were created only if they didn't exist. Existing data was preserved."
        });
    } catch (error) {
        console.error("❌ Installation failed:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        client.release();
        await pool.end();
    }
};