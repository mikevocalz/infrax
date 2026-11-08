import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

// One-time recovery of reviewed preview source into ordinary, reviewable Git files.
// Only immutable publisher hashes from this checked-in manifest are fetched.
const manifest = JSON.parse(await fs.readFile('docs/design/preview-source-manifest.json', 'utf8'));
if (manifest.schema !== 'infrax-design-source-v1' || !Array.isArray(manifest.groups)) throw Error('Invalid manifest');
const files = new Map();
for (const group of manifest.groups) {
  if (!Array.isArray(group) || group.length > 30) throw Error('Invalid source group');
  const buffers = [];
  for (const asset of group) {
    if (!/^[a-f0-9]{40}$/.test(asset.sha) || !Number.isSafeInteger(asset.size) || asset.size <= 0 || asset.size > 2000000) throw Error('Invalid source asset');
    const response = await fetch(`https://dmmcy0pwk6bqi.cloudfront.net/${asset.sha}`, {signal: AbortSignal.timeout(30000), redirect:'error'});
    if (!response.ok) throw Error(`Source fetch failed: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length !== asset.size || crypto.createHash('sha1').update(bytes).digest('hex') !== asset.sha) throw Error('Source digest mismatch');
    buffers.push(bytes);
  }
  const decoded = zlib.brotliDecompressSync(Buffer.concat(buffers), {maxOutputLength:10000000});
  const source = JSON.parse(decoded.toString('utf8'));
  if (!source || Array.isArray(source) || typeof source !== 'object') throw Error('Invalid source object');
  for (const [name, value] of Object.entries(source)) {
    const topLevel = /^(package(?:-lock)?\.json|tsconfig\.json|next\.config\.mjs|next-env\.d\.ts|original\.tailwind\.cjs|README\.md|\.gitignore)$/;
    const nested = /^(app|shared|client|preview|tests|docs|scripts)\//;
    if (typeof value !== 'string' || path.isAbsolute(name) || name.includes('\\') || name.split('/').includes('..') || name.includes('node_modules') || name.includes('.env') || (!topLevel.test(name) && !nested.test(name))) throw Error(`Rejected source path: ${name}`);
    files.set(name, value);
  }
}
if (files.size < 50 || files.size > 600) throw Error('Unexpected snapshot size');
// No files outside this isolated preview subtree are overwritten.
for (const [name, content] of files) {
  const destination = path.join('design-preview', name);
  await fs.mkdir(path.dirname(destination), {recursive:true});
  await fs.writeFile(destination, content);
}
await fs.writeFile('docs/design/preview-source-receipt.json', JSON.stringify({schema:manifest.schema,files:files.size,sourceSha256:manifest.sourceSha256,paths:[...files.keys()].sort()},null,2)+'\n');
console.log(`Restored ${files.size} reviewed preview source files. No application credentials or production changes.`);
