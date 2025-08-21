import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function QuoteModal({ show, handleClose, productId }) {
    const [draftEstimates, setDraftEstimates] = useState([]);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            fetchDraftEstimates();
        }
    }, [show]);

    const fetchDraftEstimates = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/estimate/drafts');
            setDraftEstimates(res.data);
            if (res.data.length > 0) setSelectedQuoteId(res.data[0].id);
        } catch (err) {
            console.error('DRAFT 견적서 불러오기 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id) => setSelectedQuoteId(id);

    const handleAddToExisting = async () => {
        if (!selectedQuoteId) return;
        try {
            await axiosInstance.post(`/api/estimate/${selectedQuoteId}/items`, {
                productId,
                quantity: 1,
                discountRate: 0
            });
            alert('선택한 견적서에 제품이 추가되었습니다.');
            handleClose();
        } catch (err) {
            console.error(err);
            alert('제품 추가 실패');
        }
    };

    const handleAddToNew = async () => {
        try {
            // 1. 새로운 DRAFT 견적서 생성
            const res = await axiosInstance.post('/api/estimate');
            const newEstimateId = res.data.id;

            // 2. 생성된 견적서에 제품 추가
            await axiosInstance.post(`/api/estimate/${newEstimateId}/items`, {
                productId,
                quantity: 1,
                discountRate: 0
            });

            alert('새로운 견적서에 제품이 추가되었습니다.');
            handleClose();
            navigate(`/estimate/${newEstimateId}`);
        } catch (err) {
            console.error(err);
            alert('새 견적서 생성 및 제품 추가 실패');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">추가할 견적서를 선택해주세요.</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Form>
                        {draftEstimates.length === 0 && <p>현재 DRAFT 견적서가 없습니다.</p>}
                        {draftEstimates.map((quote) => (
                            <Form.Check
                                key={quote.id}
                                type="radio"
                                label={quote.customerName || `견적서 #${quote.id}`}
                                name="quoteOptions"
                                id={`quote-${quote.id}`}
                                checked={selectedQuoteId === quote.id}
                                onChange={() => handleSelect(quote.id)}
                                className="mb-2"
                            />
                        ))}
                    </Form>
                )}
            </Modal.Body>

            <Modal.Footer className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between w-100 gap-2">
                    <Button
                        onClick={handleAddToExisting}
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
                        onClick={handleAddToNew}
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
