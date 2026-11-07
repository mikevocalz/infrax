import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
const config:NextConfig={images:{remotePatterns:[{protocol:'https',hostname:'images.unsplash.com'}]}};
export default withPayload(config);
