import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

console.log('✅ Notion Client created successfully');
console.log('📊 Client methods available:', Object.keys(notion).join(', '));
console.log('📊 Databases methods:', notion.databases ? Object.keys(notion.databases).join(', ') : 'undefined');

async function testConnection() {
  try {
    console.log('\n🔍 Testing Notion API connection...');
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 1
    });
    console.log('✅ Successfully connected to Notion!');
    console.log(`📊 Database has entries: ${response.results.length > 0 ? 'Yes' : 'No'}`);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n💡 This might be due to:');
    console.log('   - Network restrictions in this environment');
    console.log('   - Database not shared with integration');
    console.log('   - Invalid token or database ID');
  }
}

testConnection();
