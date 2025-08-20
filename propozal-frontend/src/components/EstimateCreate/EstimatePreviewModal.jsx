import React from 'react';
import { Modal, Spinner, Image } from 'react-bootstrap';

const EstimatePreviewModal = ({ show, onHide, imageData }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>견적서 미리보기</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ minHeight: '400px', backgroundColor: '#f8f9fa' }}>
        {!imageData ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Image
            src={imageData}
            alt="견적서 미리보기"
            fluid
            style={{
              border: '1px solid #dee2e6',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EstimatePreviewModal;
