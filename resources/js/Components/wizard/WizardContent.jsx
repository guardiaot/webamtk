import React from "react";

const WizardContent = ({ step, formData, setFormData, extraParams }) => {
  return (
    <div className="wizard-content">
      {step.content({
        formData,
        setFormData,
        ...extraParams,
      })}
    </div>
  );
};

export default WizardContent;
