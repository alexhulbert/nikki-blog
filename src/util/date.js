import formatDate from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
export const dateFormatted = date => {
  let dateObj = typeof date === 'string' ? parseISO(date) : date
  window['formatDate'] = formatDate
  window['parseISO'] = parseISO
  window['dateObj'] = dateObj
  return dateObj && formatDate(dateObj, 'MMMM do, yyyy')
}
