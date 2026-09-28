import React from 'react';
import CibilReportPage from './CibilReportPage';

const Crif = () => {
    return (
        <CibilReportPage 
            bureauTitle="CRIF" 
            bureauValue="crif" 
            fields={['first_name', 'last_name', 'mobile', 'pan']} 
        />
    );
};

export default Crif;
