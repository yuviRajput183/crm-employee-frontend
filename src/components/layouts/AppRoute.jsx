import React, { Suspense } from "react";

const AppRoute = ({ ...props }) => {
    const { component: Component } = props;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    );
};

export default AppRoute;
