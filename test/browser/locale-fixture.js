// In-memory host locale for deterministic component tests. Never writes a DSH profile.
export function localeFixture(ctx) {
  let snapshot = { active: 'zh', revision: 0, locales: [{ id: 'zh' }, { id: 'en' }] }
  const dictionaries = new Map(), listeners = new Set()
  const locale = {
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    register: (namespace, dictionary) => { dictionaries.set(namespace, dictionary); return () => dictionaries.delete(namespace) },
    bind: namespace => (key, params = {}) => (dictionaries.get(namespace)?.[snapshot.active]?.[key] ?? key).replace(/\{(\w+)\}/g, (token, name) => String(params[name] ?? token)),
    setLocale: active => { snapshot = { ...snapshot, active, revision: snapshot.revision + 1 }; document.documentElement.lang = active; for (const listener of listeners) listener() },
  }
  ctx.provide('locale', locale)
  return locale
}
