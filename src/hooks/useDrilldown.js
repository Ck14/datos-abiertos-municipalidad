import { useState, useCallback } from 'react'

export function useDrilldown() {
  const [view, setViewState] = useState('programatica')
  const [path, setPath]      = useState([])

  const drillDown = useCallback((item) => {
    setPath(prev => [...prev, { key: item.key, value: item.label, levelLabel: item.levelLabel }])
  }, [])

  const drillUp = useCallback((index) => {
    setPath(prev => prev.slice(0, index))
  }, [])

  const resetPath = useCallback(() => {
    setPath([])
  }, [])

  const setView = useCallback((newView) => {
    setViewState(newView)
    setPath([])
  }, [])

  return { view, path, drillDown, drillUp, resetPath, setView }
}
