import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function findXLinks() {
    try {
        console.log('🔍 Searching for X/Twitter links in data...\n');

        const response = await notion.dataSources.query({
            data_source_id: DATABASE_ID,
            page_size: 100,
        });

        console.log(`Checking ${response.results.length} entries...\n`);

        let foundX = 0;

        response.results.forEach((page) => {
            const name = page.properties['Name, website']?.title?.[0]?.plain_text || 'Unknown';
            const commentary = page.properties['Commentary']?.rich_text?.[0]?.plain_text || '';

            // Check for X/Twitter patterns in commentary
            const xPatterns = [
                /x\.com\/\w+/gi,
                /twitter\.com\/\w+/gi,
                /@\w+/g,
                /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/\w+/gi
            ];

            for (const pattern of xPatterns) {
                const matches = commentary.match(pattern);
                if (matches) {
                    console.log(`✅ ${name}: Found X reference in commentary: ${matches.join(', ')}`);
                    foundX++;
                    break;
                }
            }

            // Also check rich_text for embedded links
            const richText = page.properties['Commentary']?.rich_text || [];
            richText.forEach(rt => {
                const link = rt.text?.link?.url || rt.href;
                if (link && (link.includes('twitter.com') || link.includes('x.com'))) {
                    console.log(`✅ ${name}: Found X link: ${link}`);
                    foundX++;
                }
            });
        });

        console.log(`\n📊 Found ${foundX} entries with potential X references`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

findXLinks();
