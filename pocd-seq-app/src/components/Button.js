import React from 'react';
import { Link } from 'react-router-dom';

export function Button() {
  return (
    <Link to='/test'>
      <button className='btn--download'>Download App</button>
    </Link>
  );
}