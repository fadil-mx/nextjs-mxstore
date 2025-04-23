import Link from 'next/link'

export default async function notfound() {
  return (
    <div className=' w-screen h-screen grid place-items-center'>
      <div className='brutalist-card'>
        <div className='brutalist-card__header'>
          <div className='brutalist-card__icon'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'></path>
            </svg>
          </div>
          <div className='brutalist-card__alert     '>Warning</div>
        </div>
        <div className='brutalist-card__message text-lg'>Page Not Found</div>
        <div className='brutalist-card__actions'>
          <Link
            href='/'
            className='brutalist-card__button brutalist-card__button--mark'
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
