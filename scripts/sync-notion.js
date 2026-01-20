import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Notion client
const NOTION_TOKEN = process.env.NOTION_API_TOKEN;

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_API_TOKEN not set!');
  console.log('\nPlease set NOTION_API_TOKEN in your .env file');
  console.log('Get your token from: https://www.notion.so/my-integrations\n');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// You need to get the actual database ID from your Notion database
// To find it: Open the database in Notion, click "..." → "Copy link"
// The ID is the part after the last slash and before the "?"
// Format: https://www.notion.so/workspace-name/DATABASE_ID?v=...
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

async function fetchVendorsFromNotion(databaseId) {
  try {
    console.log('📥 Fetching vendors from Notion database...');

    // Notion SDK v5+ uses dataSources.query() instead of databases.query()
    // The databaseId is now treated as a data_source_id
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      page_size: 100,
    });

    console.log(`✅ Found ${response.results.length} vendors in Notion`);

    // Parse the Notion data into our format
    const vendors = response.results
      .map((page, index) => {
        const props = page.properties;

        // Helper functions to extract data from Notion property types
        const getText = (prop) => {
          if (!prop) return '';
          if (prop.rich_text && prop.rich_text.length > 0) {
            return prop.rich_text[0].plain_text || '';
          }
          return '';
        };

        const getTitle = (prop) => {
          if (!prop) return '';
          if (prop.title && prop.title.length > 0) {
            return prop.title[0].plain_text || '';
          }
          return '';
        };

        const getMultiSelect = (prop) => {
          if (!prop || !prop.multi_select) return [];
          return prop.multi_select.map(item => item.name);
        };

        const getUrl = (prop) => {
          if (!prop) return null;
          return prop.url || null;
        };

        const getSelect = (prop) => {
          if (!prop || !prop.select) return '';
          return prop.select?.name || '';
        };

        // Try to find the name property (it might be called different things)
        const name = getTitle(props['Name, website']) ||
          getTitle(props['Name']) ||
          getTitle(props['Agency']) ||
          getTitle(props['Company']) ||
          getTitle(props['Agency Name']) ||
          getText(props['Name']);

        // Skip if no name
        if (!name) {
          console.log(`⚠️  Skipping entry ${index + 1} - no name found`);
          return null;
        }

        // Get services/categories
        const services = getMultiSelect(props['Services']) ||
          getMultiSelect(props['Service Categories']) ||
          getMultiSelect(props['Categories']) ||
          getMultiSelect(props['Service Type']) ||
          [];

        // Get clients (might be comma-separated text)
        let clients = [];
        const clientText = getText(props['Ex Clients']) ||
          getText(props['Clients']) ||
          getText(props['Notable Clients']) ||
          getText(props['Past Clients']) ||
          '';

        if (clientText) {
          clients = clientText
            .split(/[,\n]/)
            .map(c => c.trim())
            .filter(c => c && c.length > 0);
        }

        // Get description/commentary
        const description = getText(props['Description']) ||
          getText(props['Commentary']) ||
          getText(props['About']) ||
          getText(props['Details']) ||
          '';

        // Get status
        const status = getSelect(props['Status']) ||
          getSelect(props['Verification']) ||
          getSelect(props['Type']) ||
          'Unverified';

        // Get discount code
        const code = getText(props['Discount Code']) ||
          getText(props['Code']) ||
          getText(props['Special Offer']) ||
          getText(props['Promo']) ||
          null;

        // Get URLs
        const website = getUrl(props['Website']) ||
          getUrl(props['URL']) ||
          getUrl(props['Link']) ||
          getUrl(props['Site']) ||
          null;

        const twitter = getUrl(props['Twitter']) ||
          getUrl(props['X']) ||
          getUrl(props['Social']) ||
          getUrl(props['X Link']) ||
          null;

        const email = getText(props['Email']) ||
          getText(props['Contact']) ||
          getText(props['Contact Email']) ||
          null;

        // Get logo URL
        const logo = getUrl(props['Logo']) ||
          getUrl(props['Agency Logo']) ||
          getUrl(props['Icon']) ||
          getUrl(props['Image']) ||
          null;

        return {
          id: index + 1,
          name,
          services,
          clients,
          status,
          description,
          code,
          website,
          twitter,
          email: email ? `mailto:${email}` : null,
          logo
        };
      })
      .filter(vendor => vendor !== null); // Remove any null entries

    return vendors;
  } catch (error) {
    console.error('❌ Error fetching from Notion:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting Notion sync...\n');

    if (!DATABASE_ID) {
      console.error('❌ NOTION_DATABASE_ID not set!\n');
      console.log('📋 To get your database ID:');
      console.log('   1. Open your database in Notion');
      console.log('   2. Click the "..." menu in the top right');
      console.log('   3. Click "Copy link"');
      console.log('   4. The ID is in the URL: https://notion.so/xxxxx/DATABASE_ID?v=xxxxx');
      console.log('   5. Set it in .env file: NOTION_DATABASE_ID=your-database-id\n');
      console.log('📋 Make sure to share the database with your integration:');
      console.log('   1. In Notion, click "..." → "Connections"');
      console.log('   2. Add your integration\n');
      process.exit(1);
    }

    console.log(`📊 Using Database ID: ${DATABASE_ID}\n`);

    // Fetch vendors from Notion
    const vendors = await fetchVendorsFromNotion(DATABASE_ID);

    if (vendors.length === 0) {
      console.error('❌ No vendors found in Notion database');
      process.exit(1);
    }

    // Extract unique services
    const allServices = [...new Set(vendors.flatMap(v => v.services))].sort();

    // Extract unique statuses
    const allStatuses = [...new Set(vendors.map(v => v.status))].sort();

    // Create the vendors.js file
    const output = `export const vendors = ${JSON.stringify(vendors, null, 2)};

// Extract all unique services for filtering
export const allServices = ${JSON.stringify(allServices, null, 2)};

// Extract all unique statuses
export const allStatuses = ${JSON.stringify(allStatuses, null, 2)};
`;

    // Write to file
    const outputPath = path.join(__dirname, '../src/data/vendors.js');
    fs.writeFileSync(outputPath, output);

    console.log(`✅ Successfully synced ${vendors.length} vendors to ${outputPath}`);
    console.log(`📊 Services: ${allServices.length} categories`);
    console.log(`📊 Statuses: ${allStatuses.length} types`);
    console.log(`\n🎉 Sync complete!\n`);

    // Show summary
    console.log('📈 Summary:');
    vendors.slice(0, 5).forEach(v => {
      console.log(`   - ${v.name} (${v.services.length} services, ${v.clients.length} clients)`);
    });
    if (vendors.length > 5) {
      console.log(`   ... and ${vendors.length - 5} more`);
    }
    console.log('');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure the database is shared with your Notion integration');
    console.log('   2. Verify the NOTION_API_TOKEN is correct');
    console.log('   3. Check that NOTION_DATABASE_ID is the correct UUID');
    console.log('   4. Ensure your internet connection is working\n');
    process.exit(1);
  }
}

main();
