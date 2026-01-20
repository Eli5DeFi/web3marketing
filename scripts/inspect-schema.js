import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function inspectSchema() {
    try {
        console.log('📊 Fetching first entry to inspect ALL properties...\n');

        const response = await notion.dataSources.query({
            data_source_id: DATABASE_ID,
            page_size: 1,
        });

        if (response.results.length === 0) {
            console.log('No entries found');
            return;
        }

        // Pretty print the entire first entry
        const firstEntry = response.results[0];
        console.log('=== Full Properties Object ===\n');
        console.log(JSON.stringify(firstEntry.properties, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectSchema();
