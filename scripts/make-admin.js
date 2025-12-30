const Database = require('better-sqlite3');

const db = new Database('meals.db');

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Please provide an email address');
  console.log('\nUsage: node scripts/make-admin.js <email>');
  console.log('Example: node scripts/make-admin.js user@example.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

try {
  // Check if users table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='users'
  `).get();

  if (!tableExists) {
    console.error('❌ Error: Users table does not exist. Please run migrations first:');
    console.log('   npm run migrate');
    process.exit(1);
  }

  // Check if user already exists
  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (existingUser) {
    if (existingUser.is_admin) {
      console.log(`ℹ️  User ${email} is already an admin.`);
    } else {
      // Update existing user to admin
      db.prepare('UPDATE users SET is_admin = 1, updated_at = CURRENT_TIMESTAMP WHERE email = ?').run(email);
      console.log(`✅ User ${email} has been promoted to admin!`);
    }
  } else {
    // Create new user as admin
    db.prepare(`
      INSERT INTO users (email, is_admin) VALUES (?, 1)
    `).run(email);
    console.log(`✅ New admin user created: ${email}`);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}

