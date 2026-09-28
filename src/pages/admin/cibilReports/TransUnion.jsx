import React from 'react';
import CibilReportPage from './CibilReportPage';

const TransUnion = () => {
    return (
        <CibilReportPage 
            bureauTitle="TransUnion" 
            bureauValue="transunion" 
            fields={['name', 'mobile', 'pan', 'gender']} 
        />
    );
};

export default TransUnion;
