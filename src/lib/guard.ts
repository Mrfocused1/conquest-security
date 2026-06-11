// Tracks which editors currently hold unsaved changes so we can warn before
// the user navigates away or closes the tab.
const dirtyIds = new Set<string>()

export function setDirtyFlag(id: string, dirty: boolean) {
  if (dirty) dirtyIds.add(id)
  else dirtyIds.delete(id)
}

export function anyDirty(): boolean {
  return dirtyIds.size > 0
}

/** Returns true to proceed; prompts only when there are unsaved changes. */
export function confirmDiscard(): boolean {
  return !anyDirty() || window.confirm('You have unsaved changes. Discard them and leave?')
}
