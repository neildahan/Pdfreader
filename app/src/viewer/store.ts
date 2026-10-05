import type { Annotation } from './types';

export type AnnState = {
  annotations: Annotation[];
  past: Annotation[][];
  future: Annotation[][];
  /** Who caused the last change, so collaboration only broadcasts local edits. */
  source: 'local' | 'remote' | 'load';
};

/** A change received from another participant. */
export type RemoteOp = { kind: 'upsert'; annotation: Annotation } | { kind: 'remove'; id: string };

export type AnnAction =
  | { type: 'add'; annotation: Annotation }
  | { type: 'update'; id: string; patch: Partial<Annotation>; history?: boolean }
  | { type: 'replace'; annotation: Annotation; history?: boolean }
  | { type: 'remove'; id: string }
  | { type: 'set'; annotations: Annotation[]; history?: boolean }
  | { type: 'checkpoint' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'remote'; ops: RemoteOp[] }
  | { type: 'merge'; annotations: Annotation[] };

const LIMIT = 100;

function commit(state: AnnState, annotations: Annotation[], history = true): AnnState {
  if (!history) return { ...state, annotations, source: 'local' };
  return { annotations, past: [...state.past, state.annotations].slice(-LIMIT), future: [], source: 'local' };
}

function applyOps(list: Annotation[], ops: RemoteOp[]): Annotation[] {
  let out = list;
  for (const op of ops) {
    if (op.kind === 'remove') {
      out = out.filter((a) => a.id !== op.id);
      continue;
    }
    const i = out.findIndex((a) => a.id === op.annotation.id);
    if (i === -1) out = [...out, op.annotation];
    else if (op.annotation.updatedAt >= out[i].updatedAt) out = out.map((a, j) => (j === i ? op.annotation : a));
  }
  return out;
}

/** Union by id; the most recently updated copy wins. */
export function mergeAnnotations(base: Annotation[], incoming: Annotation[]): Annotation[] {
  return applyOps(base, incoming.map((annotation) => ({ kind: 'upsert', annotation })));
}

/**
 * Undo/redo bring back older copies of annotations. Re-stamp the ones that change
 * so collaborators accept them as the newest version.
 */
function restamp(target: Annotation[], current: Annotation[]): Annotation[] {
  const now = Date.now();
  const cur = new Map(current.map((a) => [a.id, a]));
  return target.map((a) => (cur.get(a.id) === a ? a : ({ ...a, updatedAt: now } as Annotation)));
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
      return action.history ? commit(state, action.annotations) : { annotations: action.annotations, past: [], future: [], source: 'load' };
    case 'merge':
      return commit(state, mergeAnnotations(state.annotations, action.annotations));
    case 'remote':
      // Patch every history snapshot too, so undo only reverts this user's own edits.
      return {
        annotations: applyOps(state.annotations, action.ops),
        past: state.past.map((snap) => applyOps(snap, action.ops)),
        future: state.future.map((snap) => applyOps(snap, action.ops)),
        source: 'remote',
      };
    case 'checkpoint':
      // Records the current state so a series of un-tracked edits (a drag) undoes as one step.
      return { ...state, past: [...state.past, state.annotations].slice(-LIMIT), future: [], source: 'local' };
    case 'undo': {
      if (!state.past.length) return state;
      const prev = state.past[state.past.length - 1];
      return { annotations: restamp(prev, state.annotations), past: state.past.slice(0, -1), future: [state.annotations, ...state.future], source: 'local' };
    }
    case 'redo': {
      if (!state.future.length) return state;
      const [next, ...rest] = state.future;
      return { annotations: restamp(next, state.annotations), past: [...state.past, state.annotations], future: rest, source: 'local' };
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
