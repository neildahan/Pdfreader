import type { Annotation } from './types';

export type AnnState = {
  annotations: Annotation[];
  past: Annotation[][];
  future: Annotation[][];
};

export type AnnAction =
  | { type: 'add'; annotation: Annotation }
  | { type: 'update'; id: string; patch: Partial<Annotation>; history?: boolean }
  | { type: 'replace'; annotation: Annotation; history?: boolean }
  | { type: 'remove'; id: string }
  | { type: 'set'; annotations: Annotation[]; history?: boolean }
  | { type: 'checkpoint' }
  | { type: 'undo' }
  | { type: 'redo' };

const LIMIT = 100;

function commit(state: AnnState, annotations: Annotation[], history = true): AnnState {
  if (!history) return { ...state, annotations };
  return { annotations, past: [...state.past, state.annotations].slice(-LIMIT), future: [] };
}

export function annReducer(state: AnnState, action: AnnAction): AnnState {
  switch (action.type) {
    case 'add':
      return commit(state, [...state.annotations, action.annotation]);
    case 'update':
      return commit(
        state,
        state.annotations.map((a) =>
          a.id === action.id ? ({ ...a, ...action.patch, updatedAt: Date.now() } as Annotation) : a,
        ),
        action.history ?? true,
      );
    case 'replace':
      return commit(
        state,
        state.annotations.map((a) => (a.id === action.annotation.id ? action.annotation : a)),
        action.history ?? true,
      );
    case 'remove':
      return commit(state, state.annotations.filter((a) => a.id !== action.id));
    case 'set':
      return action.history ? commit(state, action.annotations) : { annotations: action.annotations, past: [], future: [] };
    case 'checkpoint':
      // Records the current state so a series of un-tracked edits (a drag) undoes as one step.
      return { ...state, past: [...state.past, state.annotations].slice(-LIMIT), future: [] };
    case 'undo': {
      if (!state.past.length) return state;
      const prev = state.past[state.past.length - 1];
      return { annotations: prev, past: state.past.slice(0, -1), future: [state.annotations, ...state.future] };
    }
    case 'redo': {
      if (!state.future.length) return state;
      const [next, ...rest] = state.future;
      return { annotations: next, past: [...state.past, state.annotations], future: rest };
    }
  }
}

const KEY = 'margin:annotations:';

export function loadSaved(fingerprint: string): Annotation[] | null {
  try {
    const raw = localStorage.getItem(KEY + fingerprint);
    return raw ? (JSON.parse(raw) as Annotation[]) : null;
  } catch {
    return null;
  }
}

export function save(fingerprint: string, annotations: Annotation[]) {
  try {
    localStorage.setItem(KEY + fingerprint, JSON.stringify(annotations));
  } catch {
    // Storage full or blocked: autosave is a convenience, so ignore.
  }
}
