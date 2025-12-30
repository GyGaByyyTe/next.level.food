const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('meals.db');

try {
  // Create migrations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Get all migration files
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.log('⚠️  No migrations directory found. Creating it...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    console.log('✨ Migrations directory created. No migrations to run.');
    process.exit(0);
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('✨ No migration files found.');
    process.exit(0);
  }

  // Get already executed migrations
  const executedMigrations = db.prepare('SELECT name FROM migrations').all().map(m => m.name);

  console.log('🔄 Running migrations...\n');

  let migrationCount = 0;

  // Execute pending migrations
  migrationFiles.forEach(file => {
    if (!executedMigrations.includes(file)) {
      console.log(`📝 Executing migration: ${file}`);

      const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        db.exec(migrationSQL);
        db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
        console.log(`✅ Migration ${file} completed successfully\n`);
        migrationCount++;
      } catch (error) {
        console.error(`❌ Error executing migration ${file}:`, error.message);
        process.exit(1);
      }
    }
  });

  if (migrationCount === 0) {
    console.log('✨ All migrations are up to date!');
  } else {
    console.log(`✨ Successfully executed ${migrationCount} migration(s)!`);
  }
} catch (error) {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
} finally {
  db.close();
}

