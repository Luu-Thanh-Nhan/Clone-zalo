import React, { useContext, useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import { TypeHTTP, api } from '@/utils/api'
import { formatPhoneByFireBase } from '@/utils/call'
import { ThemeContext } from '@/app/context'

const SearchInput = ({ setUsers, setQueryParent }) => {

    const typeSearch = {
        name: 'Name',
        // email: 'Email',
        phone: 'Phone'
    }

    const [currentInput, setCurrentInput] = useState(typeSearch.name)
    const [query, setQuery] = useState('')
    const { data } = useContext(ThemeContext)

    useEffect(debounce(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/users/find-by-${currentInput}/${query === '' ? 'none' : currentInput === typeSearch.phone ? formatPhoneByFireBase(query) : query}` })
            .then(result => {
                setUsers(result.filter(user => {
                    if (user._id !== data.user._id && user.statusSignUp === "Complete Sign Up") {
                        return user
                    }
                }))
            })
    }, 300), [query])

    return (
        <div className='relative'>
            <input value={query} onChange={(e) => {
                setQuery(e.target.value);
                setQueryParent(e.target.value)
            }} type='text' placeholder={`Enter ${currentInput}`} className='text-[12px] pl-[80px] pr-[10px] w-[90%] h-[33px] focus:outline-0 rounded-md border-[#cacaca] mt-[5px] border-[1px]' />
            <select className='text-[12px] w-[65px] text-[#999] border-r-[2px] border-[#dfdfdf] focus:outline-none absolute translate-y-[-35%] top-[50%] left-1 bg-none' onChange={e => setCurrentInput(e.target.value)} value={currentInput}>
                <option value={typeSearch.name}>{typeSearch.name}</option>
                <option value={typeSearch.email}>{typeSearch.email}</option>
                <option value={typeSearch.phone}>{typeSearch.phone}</option>
            </select>
        </div>
    )
}

export default SearchInput