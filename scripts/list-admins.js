const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'meals.db');
const db = new Database(dbPath);

console.log('\n📋 Список администраторов:\n');

try {
  // Check if users table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='users'
  `).get();

  if (!tableExists) {
    console.error('❌ Таблица users не существует. Запустите миграции:');
    console.log('   npm run migrate');
    process.exit(1);
  }

  const admins = db.prepare('SELECT email, name, is_admin FROM users WHERE is_admin = 1').all();

  if (admins.length === 0) {
    console.log('❌ Администраторы не найдены');
    console.log('\nДля создания администратора используйте:');
    console.log('   npm run make-admin <email>');
  } else {
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name || 'No name'} (${admin.email})`);
    });
  }
} catch (error) {
  console.error('❌ Ошибка при получении списка администраторов:', error.message);
  process.exit(1);
} finally {
  db.close();
}

console.log('\n✅ Готово!\n');

