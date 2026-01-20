import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const NOTION_TOKEN = process.env.NOTION_API_TOKEN;

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_API_TOKEN not set!');
  console.log('\nPlease set NOTION_API_TOKEN in your .env file');
  console.log('Get your token from: https://www.notion.so/my-integrations\n');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

async function findDatabases() {
  try {
    console.log('🔍 Searching for databases...\n');

    // Search for all databases
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      },
      page_size: 100
    });

    if (response.results.length === 0) {
      console.log('❌ No databases found.');
      console.log('\n💡 Make sure you:');
      console.log('   1. Created a Notion integration at https://www.notion.so/my-integrations');
      console.log('   2. Shared your database with the integration:');
      console.log('      - Open database → Click "..." → Connections → Add your integration\n');
      return;
    }

    console.log(`✅ Found ${response.results.length} database(s):\n`);

    response.results.forEach((db, index) => {
      const title = db.title?.[0]?.plain_text || 'Untitled';
      console.log(`${index + 1}. ${title}`);
      console.log(`   ID: ${db.id}`);
      console.log(`   URL: ${db.url}`);
      console.log('');
    });

    console.log('\n📋 To use a database:');
    console.log('   1. Copy the ID of your vendors database');
    console.log('   2. Add it to .env file:');
    console.log('      NOTION_DATABASE_ID=<database-id>\n');

    // Try to find one that looks like vendors
    const vendorsDb = response.results.find(db => {
      const title = db.title?.[0]?.plain_text || '';
      return title.toLowerCase().includes('vendor') ||
             title.toLowerCase().includes('agencies') ||
             title.toLowerCase().includes('marketing');
    });

    if (vendorsDb) {
      const title = vendorsDb.title?.[0]?.plain_text || 'Untitled';
      console.log(`💡 Suggested database: "${title}"`);
      console.log(`   ID: ${vendorsDb.id}\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check that NOTION_API_TOKEN is correct');
    console.log('   2. Ensure the database is shared with your integration');
    console.log('   3. Verify you have internet connection\n');
  }
}

findDatabases();
