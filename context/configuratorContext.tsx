'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';

/**
 * UI view currently displayed in the main viewer.
 */
export type ViewMode = '2D' | '3D';

/**
 * Defines whether the box should be rendered as plain white
 * or with the uploaded/default graphic applied.
 */
export type SurfaceMode = 'WHITE' | 'GRAPHIC';

/**
 * Represents the current uploaded graphic source.
 * Images are used directly, PDFs are converted to an image preview first.
 */
export type GraphicSource =
  | { type: 'image'; url: string; name?: string }
  | { type: 'pdf'; url: string; name?: string };

/**
 * Global state for the box configurator.
 * This is the single source of truth shared across controls and previews.
 */
export type BoxConfiguratorState = {
  viewMode: ViewMode;
  surfaceMode: SurfaceMode;
  graphicSource?: GraphicSource;
  templateId: string;
  defaultDielineUrl: string;
};

/**
 * All supported state transitions.
 * Each action describes "what happened", not "how to mutate".
 */
type BoxConfiguratorAction =
  | { type: 'setViewMode'; payload: ViewMode }
  | { type: 'setSurfaceMode'; payload: SurfaceMode }
  | { type: 'setGraphicSource'; payload?: GraphicSource }
  | { type: 'setTemplateId'; payload: string }
  | { type: 'reset' };

/**
 * Initial app state used when the configurator mounts
 * and when the user triggers a reset.
 */
const initialState: BoxConfiguratorState = {
  viewMode: '3D',
  surfaceMode: 'WHITE',
  graphicSource: undefined,
  templateId: 'S001',
  defaultDielineUrl: '/dielines/s001_white.png',
};

/**
 * Reducer responsible for all state updates.
 * It receives the current state + an action and returns the next state.
 */
function boxConfiguratorReducer(
  state: BoxConfiguratorState,
  action: BoxConfiguratorAction
): BoxConfiguratorState {
  switch (action.type) {
    case 'setViewMode':
      return { ...state, viewMode: action.payload };

    case 'setSurfaceMode':
      return { ...state, surfaceMode: action.payload };

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

/**
 * Public API exposed by the context.
 * Components consume both the current state and semantic actions.
 */
type BoxConfiguratorContextValue = {
  state: BoxConfiguratorState;
  actions: {
    setViewMode: (mode: ViewMode) => void;
    setSurfaceMode: (mode: SurfaceMode) => void;
    setGraphicSource: (source?: GraphicSource) => void;
    setTemplateId: (templateId: string) => void;
    reset: () => void;
  };
};

const BoxConfiguratorContext = createContext<BoxConfiguratorContextValue | null>(null);

/**
 * Context provider wrapping the configurator UI.
 * It centralizes state and exposes stable action callbacks to children.
 */
export function BoxConfiguratorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(boxConfiguratorReducer, initialState);

  /**
   * Semantic actions used by UI components.
   * These wrap dispatch so components do not need to know action object shapes.
   */
  const actions = useMemo<BoxConfiguratorContextValue['actions']>(
    () => ({
      setViewMode: (mode) => dispatch({ type: 'setViewMode', payload: mode }),
      setSurfaceMode: (mode) => dispatch({ type: 'setSurfaceMode', payload: mode }),
      setGraphicSource: (source) => dispatch({ type: 'setGraphicSource', payload: source }),
      setTemplateId: (templateId) => dispatch({ type: 'setTemplateId', payload: templateId }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    []
  );

  /**
   * Memoized context value to avoid recreating the provider object unnecessarily.
   */
  const value = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return (
    <BoxConfiguratorContext.Provider value={value}>
      {children}
    </BoxConfiguratorContext.Provider>
  );
}

/**
 * Consumer hook used by components.
 * Ensures the context is only used inside the provider.
 */
export function useBoxConfigurator() {
  const context = useContext(BoxConfiguratorContext);

  if (!context) {
    throw new Error('useBoxConfigurator must be used inside BoxConfiguratorProvider');
  }

  return context;
}