import fs from 'fs';
import path from 'path';

// Read the package.json file
const content = fs.readFileSync('package.json', 'utf8');

// Fix the dev script by properly escaping quotes
const fixedContent = content.replace(
  /"dev": "nodemon --watch src --ext ts --exec ts-node -r tsconfig-paths\/register -O "\{"module": "esnext", "moduleResolution": "node", "target": "es2020", "esModuleInterop": true\}" src\/index.ts",/,
  '"dev": "nodemon --watch src --ext ts --exec ts-node -r tsconfig-paths/register -O \"{\\\"module\\\": \\\"esnext\\\", \\\"moduleResolution\\\": \\\"node\\\", \\\"target\\\": \\\"es2020\\\", \\\"esModuleInterop\\\": true}\" src/index.ts",'
);

// Write the fixed content back to the file
fs.writeFileSync('package.json', fixedContent);

console.log('Fixed package.json dev script');
