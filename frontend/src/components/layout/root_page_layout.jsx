import React from 'react';
import MenuLayer from "../../app/old/menu";

const RootPageLayout = (props) => {
    const {children} = props
    return (
        <div>
            <MenuLayer />
            <div className="paddingTop"></div>
            {children}
        </div>
    );
};

export default RootPageLayout;