import React from "react";
import { useWizard } from 'react-use-wizard';

export default function ProgressBar(){
    const { activeStep, steps } = useWizard();

    console.log(steps)
    
    // Verificar se "steps" está definido antes de usar
    const progressPercentage = steps && steps.length > 0 
        ? ((activeStep + 1) / steps.length) * 100 
        : 0;

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                style={{
                    width: `${progressPercentage}%`,
                    height: "10px",
                    backgroundColor: "#9bbb21",
                    borderRadius: "5px",
                    transition: "width 0.3s ease",
                }}
            ></div>
        </div>
    );
};

