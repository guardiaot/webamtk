import React, { useState, useRef, useEffect } from "react";

import Origem_popup from "./ksi/Origem_popup";
import Origem_popup_conteudo from "./ksi/Origem_popup_conteudo";
import Origem_popup_rodape from "./ksi/Origem_popup_rodape";



import "./Wizard.css";
import WizardHeader from "./wizard/WizardHeader";

export default function WizardWrapper({ steps, onSubmit, extraParams, updateRegistro, filePdf }) {
  const [customButton, setCustomButton] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const formRef = useRef(null);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;

    // Valida o formulário
    if (!form || !form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // if (isLastStep) {
    onSubmit(formData); // Envia os dados na última etapa
    // } else {
    //  setCurrentStep((prev) => prev + 1); // Vai para a próxima etapa
    // }
  };


  const handleNext = (event) => {
    event.preventDefault();
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Finalizar processo");
    }
  };

  const handlePrevious = (event) => {
    event.preventDefault();
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Expor o callback para os passos
  const renderButton = (button) => {
    setCustomButton(button);
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const StepComponent = steps[currentStep]?.content;

  //onClick={handleNext}

  const [isLoading, setIsLoading] = useState(true);

  // Simulando carregamento dos passos
  useEffect(() => {
    if (steps && steps.length > 0) {
      setIsLoading(false);
    }
  }, [steps]);

  return (
    <div className="wizard">
      {isLoading ? (
        <div className="loading-spinner">
          {/* Substitua isso por um spinner visual ou componente de loading */}
          <p>Carregando...</p>
        </div>
      ) : (
        steps && steps.length > 0 && (
          <form noValidate ref={formRef} onSubmit={handleSubmit} >
            <Origem_popup magin_top='55px'  >
              <WizardHeader steps={steps} currentStep={currentStep} progressPercentage={progressPercentage} />
              <Origem_popup_conteudo>
                <div className="wizard-content">
                  {StepComponent && (
                    <StepComponent
                      renderCustomButton={setCustomButton}
                      formData={formData} // Passa o estado atual do formulário
                      setFormData={setFormData} // Passa a função para atualizar o estado
                      handleNext={handleNext}
                      handlePrevious={handlePrevious}
                      updateRegistro={updateRegistro}
                      isLastStep={currentStep === steps.length - 1}
                      isFirstStep={currentStep === 0}
                      filePdf={filePdf}
                      {...extraParams}
                    />
                  )}
                </div>
              </Origem_popup_conteudo>
              <Origem_popup_rodape height="45px !important" padding="8px !important">
                <div className="wizard-footer">
                  <button disabled={isFirstStep} className="btn btn-sm btn-primary" onClick={handlePrevious}>
                    Anterior
                  </button>
                  {customButton}
                </div>
              </Origem_popup_rodape>
            </Origem_popup>
          </form>
        )
      )}
    </div>
  );
}