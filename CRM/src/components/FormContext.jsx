// FormContext.js
import React, { createContext, useContext, useState } from "react";

// Create the context
const FormContext = createContext();

// Custom hook to use the FormContext
export const useFormContext = () => useContext(FormContext);

// Provider component
export const FormProvider = ({ children }) => {
  // State to hold the form data
  const [formData, setFormData] = useState(null);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
