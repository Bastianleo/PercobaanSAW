import React, { useState, useContext, createContext } from "react";
import type { ReactNode } from "react";

import type {
  Criteria,
  Alternative,
  SAWResult,
  AHPResult,
} from "../types";

import { computeSAW } from "../utils/saw";
import { computeAHP, defaultAHPMatrix } from "../utils/ahp";

const initialCriteria: Criteria[] = [
  { id: "c1", name: "Harga", weight: 0.3, type: "cost" },
  { id: "c2", name: "Kualitas", weight: 0.35, type: "benefit" },
  { id: "c3", name: "Performa", weight: 0.2, type: "benefit" },
  { id: "c4", name: "Layanan", weight: 0.15, type: "benefit" },
];

const initialAlternatives: Alternative[] = [
  {
    id: "a1",
    name: "Produk A",
    values: { c1: 300, c2: 85, c3: 90, c4: 80 },
  },
  {
    id: "a2",
    name: "Produk B",
    values: { c1: 250, c2: 78, c3: 75, c4: 88 },
  },
  {
    id: "a3",
    name: "Produk C",
    values: { c1: 400, c2: 92, c3: 88, c4: 75 },
  },
  {
    id: "a4",
    name: "Produk D",
    values: { c1: 200, c2: 70, c3: 65, c4: 70 },
  },
  {
    id: "a5",
    name: "Produk E",
    values: { c1: 350, c2: 88, c3: 82, c4: 85 },
  },
];

interface SPKContextType {
  criteria: Criteria[];
  alternatives: Alternative[];
  ahpMatrix: number[][];
  setAhpMatrix: React.Dispatch<React.SetStateAction<number[][]>>;
  sawResults: SAWResult[];
  ahpResults: AHPResult | null;

  addCriteria: (c: Criteria) => void;
  updateCriteria: (id: string, data: Partial<Criteria>) => void;
  deleteCriteria: (id: string) => void;

  addAlternative: (a: Alternative) => void;
  updateAlternative: (id: string, data: Partial<Alternative>) => void;
  deleteAlternative: (id: string) => void;
}

const SPKContext = createContext<SPKContextType | null>(null);

export function useSPK(): SPKContextType {
  const context = useContext(SPKContext);

  if (!context) {
    throw new Error("useSPK must be used within a SPKProvider");
  }

  return context;
}

interface SPKProviderProps {
  children: ReactNode;
}

export function SPKProvider({ children }: SPKProviderProps) {
  const [criteria, setCriteria] =
    useState<Criteria[]>(initialCriteria);

  const [alternatives, setAlternatives] =
    useState<Alternative[]>(initialAlternatives);

  const [ahpMatrix, setAhpMatrix] = useState<number[][]>(() =>
    defaultAHPMatrix(initialCriteria.length)
  );

  const addCriteria = (c: Criteria) => {
    setCriteria((prev) => [...prev, c]);
    setAhpMatrix(defaultAHPMatrix(criteria.length + 1));
  };

  const updateCriteria = (
    id: string,
    data: Partial<Criteria>
  ) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...data } : c
      )
    );
  };

  const deleteCriteria = (id: string) => {
    setCriteria((prev) => {
      const next = prev.filter((c) => c.id !== id);

      setAhpMatrix(defaultAHPMatrix(next.length));

      return next;
    });
  };

  const addAlternative = (a: Alternative) => {
    setAlternatives((prev) => [...prev, a]);
  };

  const updateAlternative = (
    id: string,
    data: Partial<Alternative>
  ) => {
    setAlternatives((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...data } : a
      )
    );
  };

  const deleteAlternative = (id: string) => {
    setAlternatives((prev) =>
      prev.filter((a) => a.id !== id)
    );
  };

  const sawResults = computeSAW(criteria, alternatives);

  const ahpResults = computeAHP(criteria, ahpMatrix);

  return (
    <SPKContext.Provider
      value={{
        criteria,
        alternatives,
        ahpMatrix,
        setAhpMatrix,
        sawResults,
        ahpResults,
        addCriteria,
        updateCriteria,
        deleteCriteria,
        addAlternative,
        updateAlternative,
        deleteAlternative,
      }}
    >
      {children}
    </SPKContext.Provider>
  );
}