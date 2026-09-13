import React from "react";

const WizardHeader = ({ steps, currentStep, progressPercentage }) => {
  return (
    <div style={{ width: '98%', height: '71px', background: '#ffffff', position: 'absolute', marginTop: '-2px', zIndex: '900' }}>
      <div className="progress-bar-container" style={{ marginTop: "30px", position: 'absolute', width: '100%', background: '#e5e4e4' }}>
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
      <div className="wizard-header" style={{ position: 'absolute', width: '100%' }}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`wizard-step ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardHeader;