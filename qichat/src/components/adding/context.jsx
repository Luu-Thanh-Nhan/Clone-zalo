'use client'
import React, { createContext, useEffect, useState } from 'react'

export const AddingContext = createContext()

export const layouts = {
    ADD_FRIEND_PAGE: 'a',
    CREATE_GROUP: 'b',
    FRIEND_REQUEST: 'c'
}

export const ProviderContext = ({ children }) => {
    const [currentLayout, setCurrentLayout] = useState(layouts.ADD_FRIEND_PAGE)

    useEffect(() => {
        const adding = globalThis.localStorage.getItem('adding')
        if (adding) {
            globalThis.localStorage.removeItem('adding')
            setCurrentLayout(adding)
        }
    })

    const listData = {
        currentLayout
    }

    const listHandler = {
        setCurrentLayout
    }

    return (
        <AddingContext.Provider value={{ listData, listHandler }}>
            {children}
        </AddingContext.Provider>
    )
}