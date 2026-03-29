export const numberToWords = (num) => {
    if (num === null || num === undefined || num === '') return '';
    const n = parseInt(num, 10);
    if (isNaN(n) || n < 0) return '';
    if (n === 0) return 'Zero';

    // Increased limit to 14 digits (around 10 Lakh Crores) to avoid common overflow issues
    if (n.toString().length > 14) return 'overflow';

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (num) => {
        if (num === 0) return '';
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num / 10)] + ' ' + a[num % 10];
        if (num < 1000) return a[Math.floor(num / 100)] + 'Hundred ' + (num % 100 !== 0 ? 'and ' + convert(num % 100) : '');
        if (num < 100000) return convert(Math.floor(num / 1000)) + 'Thousand ' + convert(num % 1000);
        if (num < 10000000) return convert(Math.floor(num / 100000)) + 'Lakh ' + convert(num % 100000);
        return convert(Math.floor(num / 10000000)) + 'Crore ' + convert(num % 10000000);
    };

    const result = convert(n).replace(/\s+/g, ' ').trim();
    return result + (result ? ' Only' : '');
};
