import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'

// import Content from '../components/Content'
import { dateFormatted } from '../util/date'
import './SinglePost.css'

export default ({ fields, nextPostURL, prevPostURL, hideRouter }) => {
  const { title, date, body, categories = [] } = fields
  return (
    <article className="SinglePost section light">
      <div className="container skinny">
        {!hideRouter && (
          <Link className="SinglePost--BackButton" to="/blog/">
            <ChevronLeft /> BACK
          </Link>
        )}
        <div className="SinglePost--Content relative">
          <div className="SinglePost--Meta">
            {!!categories.length &&
              categories.map(obj => (
                <span key={obj.category} className="SinglePost--Meta--Category">
                  {obj.category}
                </span>
              ))}
            {date && (
              <span className="SinglePost--Meta--Date">
                {dateFormatted(date)}
              </span>
            )}
          </div>

          {title && <h1 className="SinglePost--Title">{title}</h1>}

          <div className="SinglePost--InnerContent">
            <div dangerouslySetInnerHTML={{ __html: body ? JSON.parse(body).html : '' }} />
          </div>
          <div className="SinglePost--Pagination">
            {!hideRouter && prevPostURL && (
              <Link
                className="SinglePost--Pagination--Link prev"
                to={prevPostURL}
              >
                Previous Post
              </Link>
            )}
            {!hideRouter && nextPostURL && (
              <Link
                className="SinglePost--Pagination--Link next"
                to={nextPostURL}
              >
                Next Post
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
