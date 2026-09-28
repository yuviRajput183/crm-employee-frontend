import React from 'react';
import CibilReportPage from './CibilReportPage';

const Experian = () => {
    return (
        <CibilReportPage 
            bureauTitle="Experian" 
            bureauValue="experian" 
            fields={['name', 'mobile', 'pan']} 
        />
    );
};

export default Experian;
