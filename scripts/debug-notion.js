import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

console.log('Checking Notion SDK structure...\n');
console.log('notion.databases:', notion.databases);
console.log('\ntype:', typeof notion.databases);
console.log('\nnotation.databases.query:', notion.databases.query);
console.log('type:', typeof notion.databases.query);

// Check all properties
console.log('\nAll properties of notion.databases:');
for (let key in notion.databases) {
  console.log(`  ${key}:`, typeof notion.databases[key]);
}

// Try different ways to access
console.log('\nTrying different access methods:');
console.log('1. notion.databases.query:', typeof notion.databases.query);
console.log('2. notion.databases["query"]:', typeof notion.databases["query"]);
console.log('3. notion["databases"]["query"]:', typeof notion["databases"]["query"]);
