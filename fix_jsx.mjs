import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p, callback);
        } else {
            callback(p);
        }
    });
}

const renamed = new Map();

walk(srcDir, (p) => {
    if (p.endsWith('.js')) {
        const content = fs.readFileSync(p, 'utf8');
        // Simple heuristic for JSX: contains HTML-like tags (e.g. <div, <Component) 
        // Not perfect, but usually enough for standard projects
        if (content.match(/<[A-Za-z][\s\S]*?>/) || content.includes('/>')) {
            const newPath = p.replace(/\.js$/, '.jsx');
            fs.renameSync(p, newPath);
            renamed.set(p, newPath);
            console.log(`Renamed: ${p} -> ${newPath}`);
        }
    }
});

// Update imports
function updateImports(dir) {
    walk(dir, (p) => {
        if (p.endsWith('.js') || p.endsWith('.jsx') || p.endsWith('.ts') || p.endsWith('.tsx')) {
            let content = fs.readFileSync(p, 'utf8');
            let modified = false;
            for (const [oldPath, newPath] of renamed.entries()) {
                const oldName = path.basename(oldPath);
                const newName = path.basename(newPath);
                // Replace in content: import ... from './oldName' or './oldName.js'
                // Because we don't know the exact relative path, we can just look for the basename if it's imported
                // Actually, just replace .js with .jsx in imports if they match the basename.
                const regex = new RegExp(`(['"\`])(.*?)${oldName}(['"\`])`, 'g');
                content = content.replace(regex, (match, p1, p2, p3) => {
                    modified = true;
                    return `${p1}${p2}${newName}${p3}`;
                });
            }
            if (modified) {
                fs.writeFileSync(p, content, 'utf8');
                console.log(`Updated imports in: ${p}`);
            }
        }
    });
}

updateImports(srcDir);
updateImports(path.join(process.cwd(), 'src')); // in case it missed some due to walk
