export const numberToWords = (num) => {
    if (num === null || num === undefined || num === '') return '';
    const n = parseInt(num, 10);
    if (isNaN(n)) return '';
    if (n === 0) return 'Zero';

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if ((n.toString()).length > 9) return 'overflow';

    const nString = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nString) return '';

    let str = '';
    str += (nString[1] != '00') ? (a[Number(nString[1])] || b[nString[1][0]] + ' ' + a[nString[1][1]]) + 'Crore ' : '';
    str += (nString[2] != '00') ? (a[Number(nString[2])] || b[nString[2][0]] + ' ' + a[nString[2][1]]) + 'Lakh ' : '';
    str += (nString[3] != '00') ? (a[Number(nString[3])] || b[nString[3][0]] + ' ' + a[nString[3][1]]) + 'Thousand ' : '';
    str += (nString[4] != '0') ? (a[Number(nString[4])] || b[nString[4][0]] + ' ' + a[nString[4][1]]) + 'Hundred ' : '';
    str += (nString[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(nString[5])] || b[nString[5][0]] + ' ' + a[nString[5][1]]) : '';

    return str.trim() + ' Only';
};
