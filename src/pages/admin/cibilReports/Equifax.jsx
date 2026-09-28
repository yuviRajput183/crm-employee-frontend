import React from 'react';
import CibilReportPage from './CibilReportPage';

const Equifax = () => {
    return (
        <CibilReportPage 
            bureauTitle="Equifax" 
            bureauValue="equifax" 
            fields={['name', 'mobile', 'pan', 'gender']} 
        />
    );
};

export default Equifax;
