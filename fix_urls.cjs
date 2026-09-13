const fs = require("fs");
const path = require("path");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
            results.push(file);
        }
    });
    return results;
}

const files = walk("./src");
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, "utf8");
    let original = content;

    // Replace document/image base URLs
    content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL\?\.replace\('\/api\/v1', ''\) \|\| 'http:\/\/localhost:3000'/g, 
        "import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin)");

    content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL\?\.replace\('\/api\/v1', ''\) \|\| 'http:\/\/localhost:4000'/g, 
        "import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || (window.location.hostname === 'localhost' ? 'http://localhost:4000' : window.location.origin)");

    // Replace API base URLs
    content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL \|\| ["']http:\/\/localhost:3000\/api\/v1["']/g,
        "import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : window.location.origin + '/api/v1')");
        
    content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL \|\| ["']http:\/\/localhost:4000\/api\/v1["']/g,
        "import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000/api/v1' : window.location.origin + '/api/v1')");

    if (content !== original) {
        fs.writeFileSync(file, content, "utf8");
        changedCount++;
        console.log("Updated:", file);
    }
});

console.log("Total files updated:", changedCount);
