import React from 'react';
import { Link } from 'react-router-dom';

export function Button() {
  return (
    <Link to='/download'>
      <button className='btn--download'>Download App</button>
    </Link>
  );
}