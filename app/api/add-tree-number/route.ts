import { NextResponse } from 'next/server';
import { query } from '@/lib/db-config';

export async function POST() {
  try {
    // Add tree_number column to trees table
    try {
      await query(`
        ALTER TABLE trees ADD COLUMN tree_number VARCHAR(100)
      `);
    } catch (e) {
      // Column already exists, ignore
      console.log('tree_number column already exists or error:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Kolumna tree_number została dodana do tabeli trees'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
