import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, ProjectStatus, Scene, Character, Location, GenerationStep } from '../types';

interface AppState {
  projects: Project[];
  currentProject: Project | null;
  generationSteps: GenerationStep[];
  isGenerating: boolean;
}

type Action =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Project> & { id: string } }
  | { type: 'UPDATE_PROJECT_STATUS'; payload: { id: string; status: ProjectStatus } }
  | { type: 'UPDATE_SCENE'; payload: { projectId: string; scene: Scene } }
  | { type: 'SET_GENERATION_STEPS'; payload: GenerationStep[] }
  | { type: 'UPDATE_GENERATION_STEP'; payload: { stepId: string; status: GenerationStep['status']; progress: number } }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_CHARACTERS'; payload: { projectId: string; characters: Character[] } }
  | { type: 'UPDATE_LOCATIONS'; payload: { projectId: string; locations: Location[] } }
  | { type: 'REORDER_SCENES'; payload: { projectId: string; scenes: Scene[] } };

const initialState: AppState = {
  projects: [],
  currentProject: null,
  generationSteps: [],
  isGenerating: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'UPDATE_PROJECT': {
      const projects = state.projects.map((p) =>
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      );
      const currentProject =
        state.currentProject?.id === action.payload.id
          ? { ...state.currentProject, ...action.payload }
          : state.currentProject;
      return { ...state, projects, currentProject };
    }
    case 'UPDATE_PROJECT_STATUS': {
      const projects = state.projects.map((p) =>
        p.id === action.payload.id ? { ...p, status: action.payload.status } : p
      );
      const currentProject =
        state.currentProject?.id === action.payload.id
          ? { ...state.currentProject, status: action.payload.status }
          : state.currentProject;
      return { ...state, projects, currentProject };
    }
    case 'UPDATE_SCENE': {
      const projects = state.projects.map((p) =>
        p.id === action.payload.projectId
          ? {
              ...p,
              scenes: p.scenes.map((s) =>
                s.id === action.payload.scene.id ? action.payload.scene : s
              ),
            }
          : p
      );
      const currentProject =
        state.currentProject?.id === action.payload.projectId
          ? {
              ...state.currentProject,
              scenes: state.currentProject.scenes.map((s) =>
                s.id === action.payload.scene.id ? action.payload.scene : s
              ),
            }
          : state.currentProject;
      return { ...state, projects, currentProject };
    }
    case 'SET_GENERATION_STEPS':
      return { ...state, generationSteps: action.payload };
    case 'UPDATE_GENERATION_STEP':
      return {
        ...state,
        generationSteps: state.generationSteps.map((s) =>
          s.id === action.payload.stepId
            ? { ...s, status: action.payload.status, progress: action.payload.progress }
            : s
        ),
      };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'DELETE_PROJECT': {
      const projects = state.projects.filter((p) => p.id !== action.payload);
      const currentProject =
        state.currentProject?.id === action.payload ? null : state.currentProject;
      return { ...state, projects, currentProject };
    }
    case 'UPDATE_CHARACTERS': {
      const projects = state.projects.map((p) =>
        p.id === action.payload.projectId ? { ...p, characters: action.payload.characters } : p
      );
      const currentProject =
        state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, characters: action.payload.characters }
          : state.currentProject;
      return { ...state, projects, currentProject };
    }
    case 'UPDATE_LOCATIONS': {
      const projects = state.projects.map((p) =>
        p.id === action.payload.projectId ? { ...p, locations: action.payload.locations } : p
      );
      const currentProject =
        state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, locations: action.payload.locations }
          : state.currentProject;
      return { ...state, projects, currentProject };
    }
    case 'REORDER_SCENES': {
      const projects = state.projects.map((p) =>
        p.id === action.payload.projectId ? { ...p, scenes: action.payload.scenes } : p
      );
      const currentProject =
        state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, scenes: action.payload.scenes }
          : state.currentProject;
      return { ...state, projects, currentProject };
    }
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
