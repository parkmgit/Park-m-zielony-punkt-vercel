// Database configuration - PostgreSQL only
console.log('🚀 Using PostgreSQL');

export { query, queryOne, initDB, resetDbClient, testConnection } from './db';
