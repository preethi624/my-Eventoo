import React from 'react';
interface SearchInputProps{
    value:string;
    onChange:(value:string)=>void;
    placeholder?:string
}
const SearchInput:React.FC<SearchInputProps>=({value,onChange,placeholder='search...'})=>{
    return(
        <input
        type="text"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
    )
}
export default SearchInput