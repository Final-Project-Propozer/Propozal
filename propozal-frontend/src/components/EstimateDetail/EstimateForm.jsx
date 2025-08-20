import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EstimateForm = ({ estimateId, readOnly = false }) => {
  const navigate = useNavigate();
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCompanyName: '',
    customerPosition: '',
    expirationDate: '',
    dealStatus: '',
    sentDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [memoList, setMemoList] = useState([]);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await axiosInstance.get(`/estimate/${estimateId}`);
        const data = res.data;
        setFormData({
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerPhone: data.customerPhone || '',
          customerCompanyName: data.customerCompanyName || '',
          customerPosition: data.customerPosition || '',
          expirationDate: data.expirationDate || '',
          dealStatus: data.dealStatus?.toString() || '',
          sentDate: data.sentDate || ''
        });
      } catch (err) {
        setError('견적서 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchMemos = async () => {
      try {
        const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
        setMemoList(res.data);
      } catch (err) {
        console.error('메모 조회 실패:', err);
      }
    };

    if (estimateId) {
      fetchEstimate();
      fetchMemos();
    }
  }, [estimateId]);

  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await axiosInstance.patch(`/estimate/${estimateId}`, formData);
      setSuccess(true);
    } catch (err) {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = () => {
    alert('불러오기 기능은 아직 구현되지 않았습니다.');
  };

  const handleMemoSave = async () => {
    try {
      await axiosInstance.post(`/estimates/${estimateId}/memos`, {
        content: memoText
      });
      setMemoText('');
      setShowMemoModal(false);
      alert('메모가 저장되었습니다.');
      const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
      setMemoList(res.data);
    } catch (err) {
      alert('메모 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    pdf.save(`견적서_${estimateId}.pdf`);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <div ref={pdfRef}>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">견적서 조회</h3>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => setShowMemoModal(true)}>메모하기</Button>
              <Button variant="outline-success" onClick={handleLoad}>불러오기</Button>
              <Button variant="outline-primary" onClick={handleDownloadPDF}>다운로드</Button>
            </div>
          </div>

          <h4 className="mb-3">고객 정보</h4>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">저장되었습니다.</Alert>}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>견적서 ID</Form.Label>
                <Form.Control
                  type="text"
                  value={estimateId}
                  readOnly
                  style={{ backgroundColor: '#f1f1f1' }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>고객명 *</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>이메일 *</Form.Label>
                <Form.Control
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>전화번호</Form.Label>
                <Form.Control
                  type="text"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>회사명</Form.Label>
                <Form.Control
                  type="text"
                  name="customerCompanyName"
                  value={formData.customerCompanyName}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>직책</Form.Label>
                <Form.Control
                  type="text"
                  name="customerPosition"
                  value={formData.customerPosition}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>견적 송부일</Form.Label>
                <Form.Control
                  type="date"
                  name="sentDate"
                  value={formData.sentDate}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>견적 유효일</Form.Label>
                <Form.Control
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>프로세스 단계</Form.Label>
                <Form.Select
                  name="dealStatus"
                  value={formData.dealStatus}
                  onChange={handleChange}
                  disabled={readOnly}
                >
                  <option value="">선택하세요</option>
                  <option value="1">작성중</option>
                  <option value="2">송부완료</option>
                  <option value="3">검토중</option>
                  <option value="4">승인완료</option>
                  <option value="5">거절됨</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

                    {!readOnly && (
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={saving}
                          style={{ width: '100px' }}
                        >
                          {saving ? '저장 중...' : '확인'}
                        </Button>
                      </div>
                    )}
                  </Form>
                </div>

                {/* 메모 모달 */}
                <Modal show={showMemoModal} onHide={() => setShowMemoModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>메모하기</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group>
                      <Form.Label>메모 내용</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={memoText}
                        onChange={(e) => setMemoText(e.target.value)}
                        placeholder="메모를 입력하세요..."
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMemoModal(false)}>
                      닫기
                    </Button>
                    {!readOnly && (
                      <Button variant="primary" onClick={handleMemoSave}>
                        저장
                      </Button>
                    )}
                  </Modal.Footer>
                </Modal>

                {/* 메모 목록 표시 */}
                {memoList.length > 0 && (
                  <div className="mt-5">
                    <h5>작성된 메모</h5>
                    <ul className="list-group">
                      {memoList.map((memo) => (
                        <li key={memo.id} className="list-group-item">
                          <div>{memo.content}</div>
                          {memo.createdAt && (
                            <small className="text-muted d-block mt-1">
                              작성일: {new Date(memo.createdAt).toLocaleString()}
                            </small>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            );
          };

          export default EstimateForm;
