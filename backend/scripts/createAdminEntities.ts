/* eslint-disable @typescript-eslint/no-use-before-define */
import { sync } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, join } from 'node:path';

interface Import {
  classNames: string[];
  path: string;
}

async function run() {
  const matches = sync(join(__dirname, '../src/**/*.entity.ts'));
  const imports: Import[] = [];

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

      imports.push({
        classNames,
        path: relative(join(__dirname, '../src'), outPath.replace(/\.ts$/, '')),
      });

      return writeFile(outPath, newValue);
    }),
  );

  imports.sort((a, b) => a.path.localeCompare(b.path));

  const importClassNames = imports
    .flatMap(({ classNames }) => `  ${classNames}`)
    .join(',\n');

  const importsFile = `
${imports.map(getImport).join(';\n')};

${imports.map(getExport).join(';\n')};

export const resources = [\n${importClassNames},\n];
`.trimStart();

  await writeFile(
    join(__dirname, '../src/admin/admin.imports.ts'),
    importsFile,
  );
}

run();

// UTILS
function getImport({ classNames, path }: Import) {
  return `import { ${classNames.join(', ')} } from '${path}'`;
}

// UTILS
function getExport({ classNames, path }: Import) {
  return `export { ${classNames.join(', ')} } from '${path}'`;
}
