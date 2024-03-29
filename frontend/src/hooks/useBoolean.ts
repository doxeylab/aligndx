import { useState } from 'react'

export function useBoolean(defaultValue = false) {
    const [value, setValue] = useState(defaultValue)

    const onTrue = () => setValue(true)

    const onFalse = () => setValue(false)

    const onToggle = () => setValue(!value)

    return {
        value,
        onTrue,
        onFalse,
        onToggle,
        setValue,
    }
}
