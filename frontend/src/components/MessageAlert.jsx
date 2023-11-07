import Alert from 'react-bootstrap/Alert';
import React from 'react';
// Show message alert at top of the page
// 'primary',
// 'secondary',
// 'success',
// 'danger',
// 'warning',
// 'info',
// 'light',
// 'dark',
export default function MessageAlert (props) {
  const [show, setShow] = React.useState(true);
  return (
    <>
      {show &&
        <Alert key={props.msgType} variant={props.msgType} onClose={() => setShow(false)} dismissible>
          {props.msgContent}
        </Alert>
      }
    </>
  );
}
