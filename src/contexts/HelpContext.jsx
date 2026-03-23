import { createContext, useContext, useState, useCallback } from 'react'

const HelpContext = createContext(null)

export function HelpProvider({ children }) {
  const [helpMsg, setHelpMsg] = useState(null) // { label, message } | null

  const showHelp = useCallback((label, message) => {
    setHelpMsg({ label, message })
  }, [])

  const clearHelp = useCallback(() => {
    setHelpMsg(null)
  }, [])

  return (
    <HelpContext.Provider value={{ helpMsg, showHelp, clearHelp }}>
      {children}
    </HelpContext.Provider>
  )
}

export function useHelp() {
  return useContext(HelpContext)
}
