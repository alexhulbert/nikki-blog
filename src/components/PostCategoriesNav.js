import React from 'react'
import { NavLink } from 'react-router-dom'

import { slugify } from '../util/url'
import './PostCategoriesNav.css'

const PostCategoriesNav = ({ categories, hideRouter }) => (
  <div className='container'>
    <div className='PostCategoriesNav'>
      {hideRouter ? <span>All</span> : <NavLink className='NavLink' exact to={`/blog/`}>All</NavLink>}
      {categories.map((category, index) => (
        hideRouter ? (
          <NavLink
            className='NavLink'
            key={category.title + index}
            to={`/blog/category/${slugify(category.title)}/`}
          >
            {category.title}
          </NavLink>
        ) : <span>{category.title}</span>
      ))}
    </div>
  </div>
)

export default PostCategoriesNav
