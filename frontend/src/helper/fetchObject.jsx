// help return an object for fetch function
export default function fetchObject (method, body = null, ifAuthed = true) {
  const fetchObj = {
    method,
    headers: {
      'Content-type': 'application/json',
      Authorization: ifAuthed ? `Bearer ${localStorage.getItem('token')}` : undefined,
    }
  };

  if (method !== 'GET') {
    fetchObj.body = JSON.stringify(body);
  }

  return fetchObj;
}
