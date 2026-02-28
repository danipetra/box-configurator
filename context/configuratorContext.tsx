'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type ViewMode = '2D' | '3D';

export type GraphicSource =
  | { type: 'image'; url: string; name?: string }
  | { type: 'pdf'; url: string; name?: string };

export type ConfiguratorState = {
  viewMode: ViewMode;
  graphicSource?: GraphicSource;
  templateId: string; // e.g. "S001"
};

type Action =
  | { type: 'setViewMode'; payload: ViewMode }
  | { type: 'setGraphicSource'; payload?: GraphicSource }
  | { type: 'setTemplateId'; payload: string }
  | { type: 'reset' };

const initialState: ConfiguratorState = {
  viewMode: '3D',
  graphicSource: undefined,
  templateId: 'S001',
};

function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case 'setViewMode':
      return { ...state, viewMode: action.payload };
    case 'setGraphicSource':
      return { ...state, graphicSource: action.payload };
    case 'setTemplateId':
      return { ...state, templateId: action.payload };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

type ConfiguratorContextValue = {
  state: ConfiguratorState;
  actions: {
    setViewMode: (m: ViewMode) => void;
    setGraphicSource: (s?: GraphicSource) => void;
    setTemplateId: (id: string) => void;
    reset: () => void;
  };
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo<ConfiguratorContextValue['actions']>(
    () => ({
      setViewMode: (m) => dispatch({ type: 'setViewMode', payload: m }),
      setGraphicSource: (s) => dispatch({ type: 'setGraphicSource', payload: s }),
      setTemplateId: (id) => dispatch({ type: 'setTemplateId', payload: id }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>;
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error('useConfigurator must be used inside ConfiguratorProvider');
  return ctx;
}