import { useEffect, useId } from 'react'
import { setDirtyFlag } from '../lib/guard'

/** Register this editor's unsaved state with the global navigation guard. */
export function useDirtyGuard(dirty: boolean) {
  const id = useId()
  useEffect(() => {
    setDirtyFlag(id, dirty)
    return () => setDirtyFlag(id, false)
  }, [id, dirty])
}
