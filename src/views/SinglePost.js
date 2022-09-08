import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'

// import Content from '../components/Content'
import { HtmlGenerator, parse } from 'latex.js'
import { dateFormatted } from '../util/date'
import './SinglePost.css'

const hash = s => s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
const generator = new HtmlGenerator({ hyphenate: false })
function compileLatex(date, latex) {
  const localHash = hash(latex).toString()
  const storedHash = window.localStorage.getItem(`latex-${date}-hash`)
  if (localHash === storedHash) {
    console.log('Using cached html')
    return window.localStorage.getItem(`latex-${date}-html`)
  } else {
    console.log('Not using cached html')
    const base = window.location.origin + '/latex/'
    generator.reset();
    try {
      const html = parse(latex || '', { generator }).htmlDocument(base).documentElement.innerHTML;
      window.localStorage.setItem(`latex-${date}-hash`, localHash)
      window.localStorage.setItem(`latex-${date}-html`, html)
      return html
    } catch (e) {
      console.error(e)
      return `<p>Syntax Error ${e.location.start.line}:${e.location.start.column}-${e.location.end.line}:${e.location.end.column}:</p><br><p>${e.message}</p>`
    }
  }
}

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
            <div dangerouslySetInnerHTML={{ __html: body ? compileLatex(date, body) : '' }} />
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
