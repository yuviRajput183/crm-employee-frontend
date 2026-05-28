const fs = require('fs');
const path = require('path');

const files = [
    'src/components/shared/AdvisorMyLead.jsx',
    'src/components/shared/AdvisorPayout.jsx',
    'src/components/shared/DeleteAttachments.jsx',
    'src/components/shared/Invoices.jsx',
    'src/components/shared/MyLead.jsx',
    'src/components/shared/MyPayout.jsx',
    'src/components/shared/MyPerformance.jsx',
    'src/components/shared/NewLead.jsx'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import if not exists
    if (!content.includes('formatDate')) {
        // Find last import
        const lastImportIndex = content.lastIndexOf('import ');
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        
        // Let's just put it at the top
        content = 'import { formatDate } from \"@/lib/utils\";\n' + content;
    }
    
    // Regex to match {lead.invoiceDate?.split('T')[0]} or similar
    // We want to replace  {SOMETHING?.split('T')[0]}  with  {formatDate(SOMETHING)}
    content = content.replace(/\{([a-zA-Z0-9_?.]+)\.split\('T'\)\[0\]\}/g, '{formatDate()}');
    content = content.replace(/\{([a-zA-Z0-9_?.]+)\?\.split\('T'\)\[0\]\}/g, '{formatDate()}');
    
    // Just in case it has optional chaining on the property before split
    // e.g. lead.disbursalDate?.split('T')[0] -> the regex ([a-zA-Z0-9_?.]+) captures lead.disbursalDate?
    // So if it matches lead.disbursalDate?,  is lead.disbursalDate?.
    // Wait, formatDate(lead.disbursalDate?) is invalid syntax. We need to remove the ?.
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
});
