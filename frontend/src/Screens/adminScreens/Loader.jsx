import React from 'react'
import { PropagateLoader } from 'react-spinners';
const Loader = () => {
  return (
    <div className="flex justify-center items-center bg-indigo-200">
    <PropagateLoader color={'#4B0082'} loading={true} />
  </div>
  )
}

export default Loader
