import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

// Modal for error messages
export default function ConfirmModal (props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Alert
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>
          {props.msg}
        </h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={props.func}>Confirm</Button>
        <Button variant='outline-secondary' onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}
