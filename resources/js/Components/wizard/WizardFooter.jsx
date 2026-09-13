import React from "react";

const WizardFooter = ({ isFirstStep, isLastStep, handleNext, handlePrevious, extraButtons, extraParams }) => {
  return (
    <div className="wizard-footer">
      <button disabled={isFirstStep} className="btn btn-sm btn-primary" onClick={handlePrevious}>
        Anterior
      </button>
      <button type="submit" className="btn btn-sm btn-success">
        Salvar
      </button>
      {extraButtons &&
        extraButtons({
          handleNext,
          isLastStep,
          ...extraParams,
        })}
    </div>
  );
};

export default WizardFooter;
