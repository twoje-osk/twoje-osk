/* eslint-disable @typescript-eslint/no-use-before-define */
import { sync } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, join } from 'node:path';

async function run() {
  const matches = sync(join(__dirname, '../src/**/*.entity.ts'));
  const imports: string[] = [];
  const classes: string[] = [];

  await Promise.all(
    matches.map(async (path) => {
      const filePromise = readFile(path, { encoding: 'utf-8' });

      const dir = dirname(path);
      const extension = extname(path);
      const filename = path.substring(
        dir.length + 1,
        path.length - extension.length,
      );

      const outPath = [dir, [filename, '.admin', extension].join('')].join('/');

      const file = await filePromise;

      const classMatches = Array.from(
        file.matchAll(/@Entity\(\)(?:\n|.)+? class (.+?) /g),
      );

      const classNames = classMatches
        .map(([, match]) => match)
        .filter(<T>(m: T | undefined): m is T => m !== undefined);

      const newValueWithoutImport = file
        .replace(/(export class) (.+?) {/g, '$1 $2 extends BaseEntity {')
        .replace(/(\.entity)/g, '$1.admin');
      const newValue = `import { BaseEntity } from "typeorm";\n${newValueWithoutImport}`;

      imports.push(
        `import { ${classNames.join(', ')} } from '${relative(
          join(__dirname, '../src'),
          outPath.replace(/\.ts$/, ''),
        )}'`,
      );
      classes.push(...classNames);

      return writeFile(outPath, newValue);
    }),
  );

  const importsFile = `
${imports.join(';\n')};

export const resources = [${classes.join(', ')}];
`.trimStart();

  await writeFile(join(__dirname, '../src/admin.imports.ts'), importsFile);
}

run();
