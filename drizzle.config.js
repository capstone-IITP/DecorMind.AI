import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './config/schema.js',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_SNGMQvPK06Ym@ep-black-dust-a82wfd9o-pooler.eastus2.azure.neon.tech/AI%20Room%20Designer?sslmode=require',
    },
});
