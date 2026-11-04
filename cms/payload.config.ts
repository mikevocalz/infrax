import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Pages } from './src/collections/Pages';
import { Partners } from './src/collections/Partners';
import { ResearchNotes } from './src/collections/ResearchNotes';
import { OperatorReviews } from './src/collections/OperatorReviews';
/**
 * This is the schema configuration for the dedicated InFraX CMS package.
 * Not mounted into the existing Next 15 app until the Next 16.4 upgrade and
 * Better Auth adapter integration are reviewed.
 */
export default buildConfig({
 secret: process.env.PAYLOAD_SECRET || '',
 editor: lexicalEditor(),
 db: postgresAdapter({pool:{connectionString:process.env.DATABASE_URL || ''}}),
 collections:[Pages,Partners,ResearchNotes,OperatorReviews],
 typescript:{outputFile:'./src/payload-types.ts'}
});