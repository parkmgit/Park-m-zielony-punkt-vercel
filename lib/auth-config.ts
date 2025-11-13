// Auth configuration - PostgreSQL only
console.log('🚀 Using PostgreSQL auth');

export { login, register, logout, getCurrentUser } from './auth';
export type { RegisterData } from './auth';
