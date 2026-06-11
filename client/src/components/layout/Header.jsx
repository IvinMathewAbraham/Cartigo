// Header
import React from 'react'
import SearchBar from '../../features/search/SearchBar'
export default function Header() {
    return (
        <div className="topnav">
            <div className="logo">
                <span>Cartigo</span>
            </div>
            <SearchBar />
        </div>
    )
}

