import React, { useEffect, useState } from "react"

const useLocalStorage = <S>(key: string, initialState?: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] => {
  const [value, setValue] = useState<S>(initialState as S)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    setValue(stored? parse(stored) : initialState)
  }, [])

  useEffect(() => {
    if (value !== initialState) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [value])

  return [value, setValue]
}

const parse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export default useLocalStorage