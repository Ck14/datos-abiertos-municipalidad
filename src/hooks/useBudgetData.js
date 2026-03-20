import { useState, useEffect, useCallback } from 'react'
import { loadBudgetData } from '../api/minfin'

export function useBudgetData() {
  const [records, setRecords]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [source, setSource]           = useState(null)
  const [year, setYear]               = useState(new Date().getFullYear())
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { records: data, source: src, year: yr } = await loadBudgetData()
      setRecords(data)
      setSource(src)
      setYear(yr)
      setLastUpdated(
        src === 'api'
          ? new Date().toISOString().split('T')[0]
          : `${yr}-01-01 (local)`
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { records, loading, error, source, year, lastUpdated, refetch: load }
}
