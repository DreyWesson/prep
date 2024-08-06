import React from 'react'

export const Headers = () => {
  return (
    <div className='header'>
      <i className="fa-solid fa-bars"></i>
      <form action="">
        <label htmlFor="search">
          <input type="text" placeholder='Search'/>
        </label>
      </form>
      <button>Sign Up</button>
    </div>
  )
}
