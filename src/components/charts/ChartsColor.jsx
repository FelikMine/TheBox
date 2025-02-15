import React, { useState } from "react";

const ChartsColor = ({ children }) => {
    
    const [selectedValue, setSelectedValue] = useState('Yellow');
    const [selectedValue2, setSelectedValue2] = useState('Green');
    const [selectedValue3, setSelectedValue3] = useState('Purple');

    return children({
        selectedValue,
        setSelectedValue,
        selectedValue2,
        setSelectedValue2,
        selectedValue3,
        setSelectedValue3
    });
};
export default ChartsColor;