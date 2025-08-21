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
import { FiTrash2, FiEdit3, FiCheck, FiX } from "react-icons/fi";

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

  // 🆕 인라인 편집 상태 관리
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(5);

  const [adding, setAdding] = useState(false);
  const [discounting, setDiscounting] = useState(false);
  const [updating, setUpdating] = useState(false); // 🆕 수정 로딩 상태
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isProcessingRef = useRef(false);

  useEffect(() => {
    console.log("EstimateItemTable: initialItems 변경됨:", initialItems);
    console.log("EstimateItemTable: readOnly 모드:", readOnly);

    const newItems = Array.isArray(initialItems) ? [...initialItems] : [];
    setItems(newItems);

    console.log("EstimateItemTable: items 상태 업데이트됨:", newItems);
  }, [initialItems, readOnly]);

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
      // PATCH 대신 PUT 사용 (컨트롤러와 일치)
      await axiosInstance.put(
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

  // 🆕 인라인 편집 시작
  const handleStartEdit = (item) => {
    if (readOnly) return;
    setEditingItemId(item.id);
    setEditingValues({
      quantity: item.quantity,
      discountRate: (item.discountRate * 100).toFixed(1), // 백분율로 변환
    });
  };

  // 🆕 편집 값 변경
  const handleEditChange = (field, value) => {
    setEditingValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 🆕 편집 저장
  const handleSaveEdit = async (itemId) => {
    if (readOnly) return;

    setUpdating(true);
    setError("");

    try {
      console.log("품목 수정 요청:", {
        estimateId,
        itemId,
        quantity: parseInt(editingValues.quantity),
        discountRate: parseFloat(editingValues.discountRate) / 100,
      });

      const response = await axiosInstance.put(
        `/estimate/${estimateId}/items/${itemId}`,
        {
          quantity: parseInt(editingValues.quantity),
          discountRate: parseFloat(editingValues.discountRate) / 100,
        }
      );

      console.log("품목 수정 성공:", response.data);

      setEditingItemId(null);
      setEditingValues({});

      // 응답에서 items 배열이 있으면 사용, 없으면 전체 데이터 새로고침
      if (onItemsChange) {
        if (response.data?.items) {
          onItemsChange(response.data.items);
        } else {
          // 전체 견적서 데이터를 다시 불러오기
          onItemsChange();
        }
      }

      setSuccess(true);

      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("품목 수정 오류:", err);
      setError(
        `품목 수정 중 오류가 발생했습니다: ${
          err.response?.data?.message || err.message
        }`
      );

      // 5초 후 에러 메시지 제거
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdating(false);
    }
  };

  // 🆕 편집 취소
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingValues({});
  };

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <>
      <h4 className="mb-3">견적 품목 {readOnly ? "조회" : "관리"}</h4>

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
            {!readOnly && <th>작업</th>}
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

                {/* 🆕 수량 컬럼 - 편집 가능 */}
                <td>
                  {!readOnly && editingItemId === item.id ? (
                    <Form.Control
                      type="number"
                      min="1"
                      value={editingValues.quantity}
                      onChange={(e) =>
                        handleEditChange("quantity", e.target.value)
                      }
                      size="sm"
                      style={{ width: "80px" }}
                    />
                  ) : (
                    item.quantity || 0
                  )}
                </td>

                <td>{(item.unitPrice || 0).toLocaleString()}원</td>

                {/* 🆕 할인율 컬럼 - 편집 가능 */}
                <td>
                  {!readOnly && editingItemId === item.id ? (
                    <InputGroup size="sm" style={{ width: "100px" }}>
                      <Form.Control
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={editingValues.discountRate}
                        onChange={(e) =>
                          handleEditChange("discountRate", e.target.value)
                        }
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  ) : (
                    `${((item.discountRate || 0) * 100).toFixed(0)}%`
                  )}
                </td>

                <td>{(item.subtotal || 0).toLocaleString()}원</td>

                {!readOnly && (
                  <td>
                    <div className="d-flex gap-1">
                      {editingItemId === item.id ? (
                        // 편집 모드일 때 저장/취소 버튼
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleSaveEdit(item.id)}
                            disabled={updating}
                            title="저장"
                          >
                            <FiCheck />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={updating}
                            title="취소"
                          >
                            <FiX />
                          </Button>
                        </>
                      ) : (
                        // 일반 모드일 때 편집/삭제 버튼
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleStartEdit(item)}
                            title="수정"
                          >
                            <FiEdit3 />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            title="삭제"
                          >
                            <FiTrash2 />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* readOnly 모드가 아닐 때만 품목 추가 UI 표시 */}
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
