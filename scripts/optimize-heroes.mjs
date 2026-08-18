import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'src', 'assets');
const pub = path.join(root, 'public');

await mkdir(pub, { recursive: true });

const jobs = [
  {
    file: 'hero-courtyard-day.png',
    out: 'hero-courtyard-day.webp',
    width: 1920,
    quality: 74,
  },
  {
    file: 'hero-veranda-day.png',
    out: 'hero-veranda-day.webp',
    width: 1920,
    quality: 74,
  },
  {
    file: 'hero-interior-court.png',
    out: 'hero-interior-court.webp',
    width: 1920,
    quality: 74,
  },
  {
    file: 'compound-plan.png',
    out: 'compound-plan.webp',
    width: 1280,
    quality: 62,
  },
  {
    file: 'paper-grain.png',
    out: 'paper-grain.webp',
    width: 520,
    quality: 50,
  },
];

for (const job of jobs) {
  const result = await sharp(path.join(assets, job.file))
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6 })
    .toFile(path.join(pub, job.out));
  console.log(`${job.out} ${(result.size / 1024).toFixed(0)} KB`);
}

const og = await sharp(path.join(assets, 'hero-courtyard-day.png'))
  .rotate()
  .resize({ width: 1200, withoutEnlargement: true })
  .jpeg({ quality: 72, mozjpeg: true })
  .toFile(path.join(pub, 'og-courtyard.jpg'));
console.log(`og-courtyard.jpg ${(og.size / 1024).toFixed(0)} KB`);
