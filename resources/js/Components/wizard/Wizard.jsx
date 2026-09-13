import React, { useRef } from "react";
import WizardHeader from "./WizardHeader";
import WizardContent from "./WizardContent";
import WizardFooter from "./WizardFooter";
import KsiPopup from "./KsiPopup";

const Wizard = ({ steps, currentStep, formData, setFormData, handleSubmit, handleNext, handlePrevious, extraParams, progressPercentage }) => {
  const formRef = useRef();

  return (
    <div className="wizard">
      {steps && steps.length > 0 ? (
        <form noValidate ref={formRef} onSubmit={handleSubmit}>
          <WizardHeader steps={steps} currentStep={currentStep} progressPercentage={progressPercentage} />
          <KsiPopup>
            <WizardContent step={steps[currentStep]} formData={formData} setFormData={setFormData} extraParams={extraParams} />
            <WizardFooter
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              extraButtons={steps[currentStep]?.extraButtons}
              extraParams={extraParams}
            />
          </KsiPopup>
        </form>
      ) : null}
    </div>
  );
};

export default Wizard;
