export default async function Loading() {
  return (
    <div className=' w-screen h-screen flex justify-center items-center'>
      <div className='loader'>
        <span className='loader-text'>loading</span>
        <span className='load'></span>
      </div>
    </div>
  )
}
