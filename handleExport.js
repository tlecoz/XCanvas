import fs from 'fs';
import path from 'path';

function getAllFiles(dirPath, fileList = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (filePath.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function extractExportedClasses(filePath) {
    const dirName = path.dirname(filePath);
    const src = path.join(process.cwd(), "src");
    const relativePath = path.relative(src, dirName).replace(/\\/g, '/').replace(".ts", "");
    console.log("relativePath = ", relativePath)

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const classRegex = /export\s+class\s+(\w+)/g;
    const matches = fileContent.match(classRegex);
    if (matches) {
        return matches.map(match => relativePath + "/" + match.split(' ')[2]);
    }
    return [];
}

function _generateIndexFile(files) {
    const exportedClasses = [];
    files.forEach(file => {
        const classes = extractExportedClasses(file);
        exportedClasses.push(...classes);
    });
    console.log("files = ", files)
    const indexContent = exportedClasses
        .map(className => `export * from './${className}';`)
        .join('\n');

    fs.writeFileSync('src/index.ts', indexContent);
}

export function generateIndexFile(srcDirectoryPath) {
    console.log("srcDirectory = ", srcDirectoryPath)
    const tsFiles = getAllFiles(srcDirectoryPath).filter(file => file.endsWith('.ts'));
    _generateIndexFile(tsFiles);
}
