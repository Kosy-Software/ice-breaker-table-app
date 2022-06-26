import { Writable, writable } from 'svelte/store';
import type { AppState } from './appState';

export const state: Writable<AppState> = writable({ type: "loading" });