import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function inspectSchema() {
    try {
        console.log('📊 Fetching first few entries to inspect schema...\n');

        const response = await notion.dataSources.query({
            data_source_id: DATABASE_ID,
            page_size: 3,
        });

        if (response.results.length === 0) {
            console.log('No entries found');
            return;
        }

        console.log(`Found ${response.results.length} entries\n`);

        // Inspect the first entry
        const firstEntry = response.results[0];
        console.log('=== First Entry Properties ===\n');

        const props = firstEntry.properties;
        for (const [key, value] of Object.entries(props)) {
            console.log(`Property: "${key}"`);
            console.log(`  Type: ${value.type}`);

            // Show sample value based on type
            if (value.type === 'title' && value.title?.length > 0) {
                console.log(`  Value: "${value.title[0]?.plain_text || ''}"`);
            } else if (value.type === 'rich_text' && value.rich_text?.length > 0) {
                console.log(`  Value: "${value.rich_text[0]?.plain_text || ''}"`);
            } else if (value.type === 'multi_select') {
                console.log(`  Values: [${value.multi_select?.map(s => s.name).join(', ') || ''}]`);
            } else if (value.type === 'select') {
                console.log(`  Value: "${value.select?.name || ''}"`);
            } else if (value.type === 'url') {
                console.log(`  Value: "${value.url || ''}"`);
            }
            console.log('');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectSchema();
