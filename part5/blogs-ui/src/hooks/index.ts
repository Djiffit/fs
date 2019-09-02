import { useState } from 'react'


export const useField = (type: string) => {
    const [value, setValue] = useState('')

    const onChange = (event: any) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    const input = () => {
        return {
            type, value, onChange,
        }
    }

    return {
        type, value, onChange, reset, input,
    }
}
