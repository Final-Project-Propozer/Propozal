import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Alert,
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
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: 1,
    discountRate: 0,
  });

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(5);

  const [adding, setAdding] = useState(false);
  const [discounting, setDiscounting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isProcessingRef = useRef(false);

  // 🔥 initialItems가 변경될 때마다 items 상태를 업데이트하고 로그 출력
  useEffect(() => {
    console.log("EstimateItemTable: initialItems 변경됨:", initialItems);
    console.log("EstimateItemTable: readOnly 모드:", readOnly);

    // 🔥 깊은 복사로 새로운 배열 생성
    const newItems = Array.isArray(initialItems) ? [...initialItems] : [];
    setItems(newItems);

    console.log("EstimateItemTable: items 상태 업데이트됨:", newItems);
  }, [initialItems, readOnly]);

  // 🔥 readOnly 모드일 때는 자동 추가 로직과 location state 처리 완전히 비활성화
  useEffect(() => {
    if (readOnly) {
      console.log("EstimateItemTable: readOnly 모드 - 자동 추가 로직 비활성화");
      return;
    }

    const autoAddItem = async () => {
      const productToAdd = location.state?.product;
      if (!productToAdd || isProcessingRef.current) {
        return;
      }

      console.log("EstimateItemTable: 자동 품목 추가 시작:", productToAdd);
      isProcessingRef.current = true;
      setAdding(true);
      setError("");
      setSuccess(false);

      try {
        const response = await axiosInstance.post(
          `/estimate/${estimateId}/items`,
          {
            productId: parseInt(productToAdd.id),
            quantity: 1,
            discountRate: 0,
          }
        );
        setSuccess(true);
        if (onItemsChange && response.data?.items) {
          onItemsChange(response.data.items);
        }
      } catch (err) {
        console.error("자동 품목 추가 실패:", err);
        setError(`'${productToAdd.name}' 품목 추가 중 오류가 발생했습니다.`);
      } finally {
        setAdding(false);
        isProcessingRef.current = false;
        navigate(".", { replace: true, state: {} });
      }
    };

    autoAddItem();
  }, [location.state, estimateId, navigate, onItemsChange, readOnly]);

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
      const response = await axiosInstance.post(
        `/estimate/${estimateId}/items`,
        {
          productId: parseInt(newItem.productId),
          quantity: parseInt(newItem.quantity),
          discountRate: parseFloat(newItem.discountRate) / 100,
        }
      );
      setNewItem({ productId: "", quantity: 1, discountRate: 0 });
      setSuccess(true);
      if (onItemsChange && response.data?.items) {
        onItemsChange(response.data.items);
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
      const response = await axiosInstance.delete(
        `/estimate/${estimateId}/items/${itemId}`
      );
      if (onItemsChange && response.data?.items) {
        onItemsChange(response.data.items);
      }
    } catch (err) {
      setError("품목 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSearchProduct = () => {
    if (readOnly) return;
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
          discountRate: selectedDiscount / 100,
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

  // 🔥 안전한 배열 처리
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <>
      <h4 className="mb-3">견적 품목 {readOnly ? "조회" : "관리"}</h4>

      {/* 🔥 readOnly 모드가 아닐 때만 오류/성공 메시지 표시 */}
      {!readOnly && error && <Alert variant="danger">{error}</Alert>}
      {!readOnly && success && (
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
          {safeItems.length === 0 ? (
            <tr>
              <td colSpan={readOnly ? 6 : 7} className="text-center text-muted">
                등록된 품목이 없습니다.
              </td>
            </tr>
          ) : (
            safeItems.map((item, index) => (
              <tr key={item.id || `item-${index}`}>
                <td>{item.productName || "미입력"}</td>
                <td>{item.productCode || "미입력"}</td>
                <td>{item.quantity || 0}</td>
                <td>{(item.unitPrice || 0).toLocaleString()}원</td>
                <td>{((item.discountRate || 0) * 100).toFixed(0)}%</td>
                <td>{(item.subtotal || 0).toLocaleString()}원</td>
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

      {/* 🔥 readOnly 모드가 아닐 때만 품목 추가 UI 표시 */}
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
