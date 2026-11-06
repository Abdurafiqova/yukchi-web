import type { SessionUser } from '~/types/cargo';

const STORAGE_KEY = 'yukchi.session';

export function useAuth() {
  const user = useState<SessionUser | null>('session-user', () => null);

  const loggedIn = computed(() => Boolean(user.value));

  function restore() {
    if (!import.meta.client) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      user.value = JSON.parse(raw) as SessionUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function setSession(next: SessionUser, token?: string) {
    user.value = next;
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (token) localStorage.setItem('yukchi.token', token);
    }
  }

  function logout() {
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('yukchi.token');
    }
  }

  return { user, loggedIn, restore, setSession, logout };
}
