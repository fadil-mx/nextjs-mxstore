import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/lib/constants'
import { SearchIcon } from 'lucide-react'

type Props = {}
const categories = ['men', 'women', 'kids', 'accessories']
const Search = (props: Props) => {
  return (
    <form action='/search' method='get' className='flex items-stretch h-10 '>
      <Select name='catagory'>
        <SelectTrigger className='w-fit h-full dark:border-gray-100 bg-gray-100 text-black rounded-r-none   '>
          <SelectValue placeholder='All' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            <SelectItem value='apple'>All</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        type='search'
        placeholder={`Search in ${APP_NAME}`}
        name='q'
        className='flex-1 rounded-none dark:border-gray-100 bg-gray-100 text-black h-full'
      />
      <button
        className='bg-primary text-primary-foreground text-black rounded-l-none rounded-e-md h-full px-3 py-2  '
        type='submit'
      >
        <SearchIcon className='w-6 h-6' />
      </button>
    </form>
  )
}

export default Search
