// help return an object for fetch function
export default function fetchObject (method, body, ifAuthed = true) {
  return ({
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      Authorization: ifAuthed ? `Bearer ${localStorage.getItem('token')}` : undefined,
    }
  })
}
