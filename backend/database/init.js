/**
 * backend/database/init.js
 * Run once with: npm run init-db
 * Creates the database file and all tables.
 */
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const db = require('./db');

db.ready()
  .then(() => {
    console.log('✅ Database initialized.');
    console.log('   File:', require('path').resolve(process.env.DATABASE_PATH || './backend/database/zawiya.db'));
    console.log('   Run "npm run seed" to create the admin account and sample books.');
    process.exit(0);
  })
  .catch(err => { console.error('❌ Init failed:', err); process.exit(1); });
