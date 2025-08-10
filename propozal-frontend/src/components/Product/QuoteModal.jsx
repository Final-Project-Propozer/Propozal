import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function QuoteModal({ show, handleClose }) {
  const [selectedQuote, setSelectedQuote] = useState('견적서 이름 1');
  const navigate = useNavigate();

  const handleSelect = (quote) => {
    setSelectedQuote(quote);
  };

  const handleGoToCreatePage = () => {
    navigate('/estimate/create');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">추가할 견적서를 선택해주세요.</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {['견적서 이름 1', '견적서 이름 2', '견적서 이름 3'].map((quote) => (
            <Form.Check
              key={quote}
              type="radio"
              label={quote}
              name="quoteOptions"
              id={quote}
              checked={selectedQuote === quote}
              onChange={() => handleSelect(quote)}
              className="mb-2"
            />
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column gap-2">
        {/* 상단 두 버튼: 나란히 배치 */}
        <div className="d-flex justify-content-between w-100 gap-2">
          <Button
            onClick={() => alert(`"${selectedQuote}"에 추가되었습니다`)}
            style={{
              backgroundColor: '#588174',
              borderColor: '#588174',
              color: '#fff',
              width: '50%',
            }}
          >
            해당 견적서에 추가
          </Button>

          <Button
            onClick={handleGoToCreatePage}
            style={{
              backgroundColor: '#BDDFBC',
              borderColor: '#BDDFBC',
              color: '#000',
              width: '50%',
            }}
          >
            새로운 견적서에 추가
          </Button>
        </div>

        {/* 하단 취소 버튼 */}
        <Button
          onClick={handleClose}
          style={{
            backgroundColor: '#F4F4F2',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            color: '#000',
            width: '100%',
          }}
        >
          취소하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuoteModal;
