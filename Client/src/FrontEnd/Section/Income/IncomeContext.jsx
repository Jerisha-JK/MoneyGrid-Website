import { createContext, useState } from "react";

export const IncomeContext = createContext();

export function IncomeProvider({ children }) {
  const [income, setIncome] = useState(0);

  return (
    <IncomeContext.Provider value={{ income, setIncome }}>
      {children}
    </IncomeContext.Provider>
  );
}
