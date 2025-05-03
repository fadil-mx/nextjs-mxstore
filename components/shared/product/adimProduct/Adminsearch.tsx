import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

const Adminsearch = () => {
  return (
    <div>
      <form method='get' action='/admin/products' className='flex  '>
        <Input
          type='search'
          placeholder={`Search in products`}
          name='q'
          className='w-60 rounded-lg rounded-r-none  dark:border-gray-100 bg-gray-200 outline-none text-black h-8'
        />
        <button
          className='bg-primary text-primary-foreground text-black rounded-l-none rounded-e-md h-full px-3 py-2  '
          type='submit'
        >
          <Search className='w-3 h-4 ' />
        </button>
      </form>
    </div>
  )
}

export default Adminsearch
