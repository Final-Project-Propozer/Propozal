import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import { FiTrash2 } from "react-icons/fi";

const EstimateItemTable = ({
  estimateId,
  initialItems,
  onItemsChange,
  readOnly = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState(initialItems || []);
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: 1,
    discountRate: 0, // % 단위로 입력받음
  });

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(5);

  const [adding, setAdding] = useState(false);
  const [discounting, setDiscounting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isProcessingRef = useRef(false);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  // ✅ 제품 페이지에서 전달받은 상품을 자동으로 추가하는 로직
  useEffect(() => {
    const autoAddItem = async () => {
      const productToAdd = location.state?.product;

      // 🛑 최종 방어 로직:
      // 1. 추가할 제품이 없으면 중단
      // 2. isProcessingRef가 true이면, 이미 다른 추가 작업이 시작된 것이므로 절대 중복 실행하지 않음
      if (!productToAdd || isProcessingRef.current) {
        return;
      }

      // ✅ 추가 로직 시작을 기록
      isProcessingRef.current = true;
      setAdding(true);
      setError("");
      setSuccess(false);

      try {
        await axiosInstance.post(`/api/estimate/${estimateId}/items`, {
          productId: parseInt(productToAdd.id),
          quantity: 1,
          discountRate: 0,
        });
        setSuccess(true);
        if (onItemsChange) {
          onItemsChange();
        }
      } catch (err) {
        setError(`'${productToAdd.name}' 품목 추가 중 오류가 발생했습니다.`);
      } finally {
        // ✅ 작업이 끝나면 '처리 중' 상태를 해제하고, location.state를 초기화
        setAdding(false);
        isProcessingRef.current = false;
        navigate(".", { replace: true, state: {} });
      }
    };

    autoAddItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, estimateId, navigate, onItemsChange]);

  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (readOnly) return;

    setAdding(true);
    setError("");
    setSuccess(false);
    try {
      await axiosInstance.post(`/estimate/${estimateId}/items`, {
        productId: parseInt(newItem.productId),
        quantity: parseInt(newItem.quantity),
        discountRate: parseFloat(newItem.discountRate) / 100, // ✅ 소수로 변환
      });
      setNewItem({ productId: "", quantity: 1, discountRate: 0 });
      setSuccess(true);
      if (onItemsChange) {
        onItemsChange();
      }
    } catch (err) {
      setError("품목 추가 중 오류가 발생했습니다.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (readOnly) return;
    try {
      await axiosInstance.delete(`/estimate/${estimateId}/items/${itemId}`);
      if (onItemsChange) {
        onItemsChange();
      } else {
        fetchItems();
      }
    } catch (err) {
      setError("품목 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSearchProduct = () => {
    navigate("/products", { state: { estimateId } });
  };

  const handleApplyDiscount = async () => {
    if (readOnly || !selectedItemId) return;

    setDiscounting(true);
    setError("");
    try {
      await axiosInstance.patch(
        `/estimate/${estimateId}/items/${selectedItemId}`,
        {
          discountRate: selectedDiscount / 100, // ✅ 소수로 변환
        }
      );
      setSelectedItemId("");
      setSelectedDiscount(5);
      if (onItemsChange) {
        onItemsChange();
      }
    } catch (err) {
      setError("할인 적용 중 오류가 발생했습니다.");
    } finally {
      setDiscounting(false);
    }
  };

  return (
    <>
      <h4 className="mb-3">견적 품목</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && !readOnly && (
        <Alert variant="success">품목이 성공적으로 처리되었습니다.</Alert>
      )}

      <Table responsive bordered hover>
        <thead className="table-light">
          <tr>
            <th>상품명</th>
            <th>코드</th>
            <th>수량</th>
            <th>단가</th>
            <th>할인율</th>
            <th>금액</th>
            {!readOnly && <th>삭제</th>}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={readOnly ? 6 : 7} className="text-center text-muted">
                등록된 품목이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.productCode}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toLocaleString()}원</td>
                <td>{(item.discountRate * 100).toFixed(0)}%</td>
                <td>{item.subtotal.toLocaleString()}원</td>
                {!readOnly && (
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label="삭제"
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {!readOnly && (
        <>
          <Button
            variant="outline-success"
            className="w-100 mb-4"
            onClick={handleSearchProduct}
          >
            + 제품 검색해서 추가하기
          </Button>

          <Form onSubmit={handleAddItem}>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>상품 ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="productId"
                    value={newItem.productId}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>수량</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>할인율 (%)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="discountRate"
                      value={newItem.discountRate}
                      onChange={handleChange}
                      min={0}
                      max={100}
                      step={1}
                      required
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2}>
                <div className="mt-3">
                  <Button
                    type="submit"
                    variant="success"
                    disabled={adding}
                    className="w-100"
                  >
                    {adding ? "추가 중..." : "품목 추가"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};

export default EstimateItemTable;
