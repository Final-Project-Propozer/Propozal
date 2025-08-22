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

  const [editingItemId, setEditingItemId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(5);

  const [adding, setAdding] = useState(false);
  const [discounting, setDiscounting] = useState(false);
  const [updating, setUpdating] = useState(false);
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
      if (!productToAdd || isProcessingRef.current) return;

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
    if (readOnly || !itemId) return;
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
      await axiosInstance.put(
        `/estimate/${estimateId}/items/${selectedItemId}`,
        { discountRate: selectedDiscount / 100 }
      );
      setSelectedItemId("");
      setSelectedDiscount(5);
      if (onItemsChange) onItemsChange();
    } catch (err) {
      setError("할인 적용 중 오류가 발생했습니다.");
    } finally {
      setDiscounting(false);
    }
  };

  const handleStartEdit = (item, rowId) => {
    if (readOnly) return;
    if (!rowId) {
      setError("아이템 식별자가 없어 수정할 수 없습니다.");
      return;
    }
    setEditingItemId(rowId);
    setEditingValues({
      quantity: String(item.quantity ?? 1),
      discountRate: String(((item.discountRate ?? 0) * 100).toFixed(1)),
    });
  };

  const handleEditChange = (field, value) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (itemId) => {
    if (readOnly || !itemId) return;

    setUpdating(true);
    setError("");

    try {
      const q = parseInt(editingValues.quantity);
      const r = parseFloat(editingValues.discountRate);

      const response = await axiosInstance.put(
        `/estimate/${estimateId}/items/${itemId}`,
        {
          quantity: Number.isFinite(q) && q > 0 ? q : 1,
          discountRate: Number.isFinite(r) ? r / 100 : 0,
        }
      );

      setEditingItemId(null);
      setEditingValues({});

      if (onItemsChange) {
        if (response.data?.items) onItemsChange(response.data.items);
        else onItemsChange();
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("품목 수정 오류:", err);
      setError(
        `품목 수정 중 오류가 발생했습니다: ${
          err.response?.data?.message || err.message
        }`
      );
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdating(false);
    }
  };

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
            safeItems.map((item, index) => {
              const rowId =
                item.id ?? item.itemId ?? item.estimateItemId ?? null;

              return (
                <tr key={rowId ?? `item-${index}`}>
                  <td>{item.productName || "미입력"}</td>
                  <td>{item.productCode || "미입력"}</td>

                  <td>
                    {!readOnly && editingItemId === rowId ? (
                      <Form.Control
                        type="number"
                        min="1"
                        value={editingValues.quantity ?? ""}
                        onChange={(e) =>
                          handleEditChange("quantity", e.target.value)
                        }
                        size="sm"
                        style={{ width: "80px" }}
                        disabled={updating}
                      />
                    ) : (
                      item.quantity || 0
                    )}
                  </td>

                  <td>{(item.unitPrice || 0).toLocaleString()}원</td>

                  <td>
                    {!readOnly && editingItemId === rowId ? (
                      <InputGroup size="sm" style={{ width: "100px" }}>
                        <Form.Control
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={editingValues.discountRate ?? ""}
                          onChange={(e) =>
                            handleEditChange("discountRate", e.target.value)
                          }
                          disabled={updating}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    ) : (
                      `${((item.discountRate || 0) * 100).toFixed(1)}%`
                    )}
                  </td>

                  <td>{(item.subtotal || 0).toLocaleString()}원</td>

                  {!readOnly && (
                    <td>
                      <div className="d-flex gap-1">
                        {editingItemId === rowId ? (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleSaveEdit(rowId)}
                              disabled={updating || !rowId}
                              title="저장"
                              type="button"
                            >
                              <FiCheck />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={updating}
                              title="취소"
                              type="button"
                            >
                              <FiX />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleStartEdit(item, rowId)}
                              title="수정"
                              type="button"
                              disabled={!rowId}
                            >
                              <FiEdit3 />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteItem(rowId)}
                              title="삭제"
                              type="button"
                              disabled={!rowId}
                            >
                              <FiTrash2 />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {!readOnly && (
        <>
          <Button
            variant="outline-success"
            className="w-100 mb-4"
            onClick={handleSearchProduct}
            type="button"
            disabled={adding || updating || discounting}
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
                    disabled={adding}
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
                    disabled={adding}
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
                      disabled={adding}
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
