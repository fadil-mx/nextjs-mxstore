'use client'
import { cn, formatDateTime } from '@/lib/utils'
import React, { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalculatorIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { PopoverClose } from '@radix-ui/react-popover'

type Props = {
  defultDate?: DateRange
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}

const DateRange = ({ defultDate, setDate, className }: Props) => {
  const [calenderDate, setCalenderDate] = useState<DateRange | undefined>(
    defultDate
  )
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='date '
            className={cn(
              'justify-start text-left font-normal',
              !calenderDate && 'text-muted-foreground'
            )}
          >
            <CalculatorIcon className='mr-0 h-4 w-4' />
            {calenderDate?.from ? (
              calenderDate.to ? (
                <>
                  {formatDateTime(calenderDate.from).dateOnly} - {''}
                  {formatDateTime(calenderDate.to).dateOnly}
                </>
              ) : (
                formatDateTime(calenderDate.from).dateOnly
              )
            ) : (
              <span> Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onCloseAutoFocus={() => setCalenderDate(defultDate)}
          className='w-auto p-0'
          align='end'
        >
          <Calendar
            mode='range'
            defaultMonth={defultDate?.from}
            selected={calenderDate}
            onSelect={setCalenderDate}
            numberOfMonths={2}
          />
          <div className='flex gap-4 p-4 pt-0'>
            <PopoverClose asChild>
              <Button
                onClick={() => {
                  setDate(calenderDate)
                }}
              >
                Apply
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button variant='outline'>Cancel</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRange
