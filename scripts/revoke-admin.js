const Database = require('better-sqlite3');

const db = new Database('meals.db');

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Please provide an email address');
  console.log('\nUsage: node scripts/revoke-admin.js <email>');
  console.log('Example: node scripts/revoke-admin.js user@example.com');
  process.exit(1);
}

try {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    console.log(`ℹ️  User ${email} does not exist in the database.`);
  } else if (!user.is_admin) {
    console.log(`ℹ️  User ${email} is not an admin.`);
  } else {
    db.prepare('UPDATE users SET is_admin = 0, updated_at = CURRENT_TIMESTAMP WHERE email = ?').run(email);
    console.log(`✅ Admin privileges revoked from ${email}`);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}

