import classes from "./Charts.module.css";
import React, { useState } from "react";

export default function CustomDropdown({ selectedValue, setSelectedValue, backgroundColor1 }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
    };

    const optionColors = {
        Green: '#2A5757',
        Purple: '#781E79',
        Yellow: '#796E1E',
    };

    return (
        <div className={`${classes.mainColor} ${classes.selectColor}`} style={{ backgroundColor: backgroundColor1 }}>
            <div className={classes.customSelect}  style={{ backgroundColor: backgroundColor1}}  onClick={() => setIsOpen(!isOpen)}>
            </div>
            {isOpen && (
                <div className={classes.dropdown} style={{ backgroundColor: backgroundColor1}}>
                    <div
                        className={classes.dropdownItem}
                        onClick={() => handleSelect("Green")}
                        style={{ backgroundColor: optionColors.Green , borderRadius: 0}}
                    >
                    </div>
                    <div
                        className={classes.dropdownItem}
                        onClick={() => handleSelect("Purple")}
                        style={{ backgroundColor: optionColors.Purple , borderRadius: 0 }}
                    >
                    </div>
                    <div
                        className={classes.dropdownItem}
                        onClick={() => handleSelect("Yellow")}
                        style={{ backgroundColor: optionColors.Yellow , borderRadius: 0 }}
                    >
                    </div>
                </div>
            )}
        </div>
    );
};