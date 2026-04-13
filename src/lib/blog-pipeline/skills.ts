import { readFileSync } from 'fs';
import { join } from 'path';

export function loadSkill(name: string): string {
  return readFileSync(
    join(process.cwd(), 'src/lib/blog-pipeline/skills', `${name}.md`),
    'utf-8'
  );
}
