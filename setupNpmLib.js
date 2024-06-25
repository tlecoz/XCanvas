import fs from 'fs';
import path from 'path';
import commentJson from 'comment-json';
import { generateIndexFile } from './handleExport.js';

let forceCreateIndexTs = false;

const PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json');
const packageJsonData = fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8');
const packageJson = commentJson.parse(packageJsonData);
packageJson.main = `dist/${packageJson.name}.js`;
packageJson.types = "dist/index.d.ts";
packageJson.files = [
    "dist/**/*.js",
    "dist/**/*.d.ts"
];

fs.writeFileSync(PACKAGE_JSON_PATH, commentJson.stringify(packageJson, null, 2));

const TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.json');
const tsconfigData = fs.readFileSync(TSCONFIG_PATH, 'utf-8');
const tsconfig = commentJson.parse(tsconfigData);

tsconfig.compilerOptions.outDir = "dist";
tsconfig.compilerOptions.rootDir = "src";
tsconfig.compilerOptions.declarationDist = "dist";
tsconfig.compilerOptions.declaration = true;
tsconfig.compilerOptions.resolveJsonModule = true;
tsconfig.compilerOptions.skipLibCheck = true;
tsconfig.compilerOptions.noEmit = false;
tsconfig.compilerOptions.useDefineForClassFields = true;
tsconfig.compilerOptions.allowImportingTsExtensions = undefined;
tsconfig.compilerOptions.declarationDist = undefined;

if (!tsconfig.compilerOptions.typeRoots) tsconfig.compilerOptions.typeRoots = [];
if (tsconfig.compilerOptions.typeRoots.indexOf("./node_modules/@types") === -1) {
    tsconfig.compilerOptions.typeRoots.push("./node_modules/@types");
}

if (!tsconfig.include) tsconfig.include = [];
if (tsconfig.include.indexOf("src") === -1) tsconfig.include.push("src");
if (tsconfig.include.indexOf("index.ts") === -1) tsconfig.include.push("index.ts");

fs.writeFileSync(TSCONFIG_PATH, commentJson.stringify(tsconfig, null, 2));

const SRC_PATH = path.join(process.cwd(), 'src');
const indexts = path.join(SRC_PATH, "index.ts");
if (!fs.existsSync(indexts) || forceCreateIndexTs) {
    generateIndexFile(SRC_PATH);
    console.log("create src/index.ts");
}

const envFilePath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, 'VITE_FOOBAR = 1234', 'utf-8');
    console.log('create .env file');
}

const viteEnvFilePath = path.join(process.cwd(), 'vite-env.d.ts');
if (!fs.existsSync(viteEnvFilePath)) {
    fs.writeFileSync(viteEnvFilePath, `
interface ImportMeta {
    env: {
        [key: string]: string;
    };
}
    `, 'utf-8');
} else {
    let viteEnv = fs.readFileSync(viteEnvFilePath, 'utf-8');
    if (!viteEnv.includes("interface ImportMeta")) {
        viteEnv = viteEnv + `
        interface ImportMeta {
            env: {
                [key: string]: string;
            };
        }
        `;
        fs.writeFileSync(viteEnvFilePath, viteEnv, 'utf-8');
    }
}

const viteConfigFilePath = path.join(process.cwd(), 'vite.config.js');
if (!fs.existsSync(viteConfigFilePath)) {
    fs.writeFileSync(viteConfigFilePath, `
// vite.config.js
import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts';
export default defineConfig({
    plugins: [Dts()],
    build: {
        minify: false,
        lib: {
            entry: 'src/index.ts',
            name: '${packageJson.name}',
            fileName: '${packageJson.name}',
        },
    },
})
    `, 'utf-8');
}

const gitFilePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitFilePath)) {
    const gitignoreContent = fs.readFileSync(gitFilePath, 'utf-8');
    if (!gitignoreContent.includes(".env")) {
        const updatedContent = gitignoreContent + `
.env
`;
        fs.writeFileSync(gitFilePath, updatedContent, 'utf-8');
    }
} else {
    fs.writeFileSync(gitFilePath, `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

.env

    `, 'utf-8');
}
