import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function inspectSchema() {
    try {
        console.log('📊 Fetching first entry with full detail...\n');

        const response = await notion.dataSources.query({
            data_source_id: DATABASE_ID,
            page_size: 1,
        });

        if (response.results.length === 0) {
            console.log('No entries found');
            return;
        }

        const page = response.results[0];
        const name = page.properties['Name, website']?.title?.[0]?.plain_text || 'Unknown';

        console.log(`Entry: ${name}\n`);
        console.log('=== All Properties ===\n');

        for (const [key, value] of Object.entries(page.properties)) {
            console.log(`Property: "${key}"`);
            console.log(`  Type: ${value.type}`);

            // Show content based on type
            if (value.type === 'title' && value.title?.length > 0) {
                const text = value.title[0]?.plain_text || '';
                const link = value.title[0]?.text?.link?.url || value.title[0]?.href || 'none';
                console.log(`  Text: "${text}"`);
                console.log(`  Link: ${link}`);
            } else if (value.type === 'rich_text' && value.rich_text?.length > 0) {
                const text = value.rich_text[0]?.plain_text || '';
                const link = value.rich_text[0]?.text?.link?.url || value.rich_text[0]?.href || 'none';
                console.log(`  Text: "${text.substring(0, 100)}..."`);
                console.log(`  Link: ${link}`);
            } else if (value.type === 'url') {
                console.log(`  URL: ${value.url || 'null'}`);
            } else if (value.type === 'multi_select') {
                console.log(`  Values: [${value.multi_select?.map(s => s.name).join(', ')}]`);
            } else if (value.type === 'select') {
                console.log(`  Value: "${value.select?.name || ''}"`);
            }
            console.log('');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectSchema();
