"use client"
import { useState } from "react"
import { toast } from "sonner"

const useFetch = (cb: any) => {

    const [data, setData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const func = async (...args: any) => {
        setLoading(true)
        setError(null)

        try {
            const repsonse = await cb(...args)
            setData(repsonse)
            setError(null)
        }

        catch (error: any) {
            setError(error)
            toast.error(error.message)
        }

        finally{
            setLoading(false)
        }
    }

    return { data, loading, error, func, setData }
}

export default useFetch