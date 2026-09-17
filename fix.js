const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/channelPartner/AddChannelPartnerBusiness.jsx', 'utf8');

// 1. Insert capacityText and firmNameNode
content = content.replace(
    /const \{ registrationType: regType, udyam, gst \} = businessState;\s*const computedFirmName = .*?;/,
    \const { registrationType: regType, udyam, gst } = businessState;
    const computedFirmName = udyam?.enterpriseName || gst?.legalName || gst?.businessName || panName || applicantName || "[Firm Name]";
    const actualFirmName = udyam?.enterpriseName || gst?.legalName || gst?.businessName;
    const firmNameNode = actualFirmName ? <> of <strong>{actualFirmName}</strong></> : null;
    
    const getCapacity = () => {
        switch(regType) {
            case "Individual/Sole Prop": return "Self/Proprietor";
            case "HUF": return "Karta/Authorized Signatory";
            case "Partnership/LLP": return "Partner/Authorized Signatory";
            case "Company": return "Director/Authorized Signatory";
            default: return "Authorized Signatory";
        }
    };
    const capacityText = getCapacity();\
);

// 2. Replace Form 1
content = content.replace(
    /I, <strong>\{applicantName\}<\/strong>, the applicantof <strong>\{computedFirmName\}<\/strong>/g,
    'I, <strong>{applicantName}</strong>, the applicant, in the capacity of <strong>{capacityText}</strong>{firmNameNode}'
);

// 3. Replace Form 2
content = content.replace(
    /I, <strong>\{applicantName\}<\/strong> the applicantof <strong>\{computedFirmName\}<\/strong>/g,
    'I, <strong>{applicantName}</strong>, the applicant, in the capacity of <strong>{capacityText}</strong>{firmNameNode}'
);

fs.writeFileSync('src/pages/admin/channelPartner/AddChannelPartnerBusiness.jsx', content);
