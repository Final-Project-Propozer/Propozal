import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const EstimateVersionList = () => {
  const [searchEstimateId, setSearchEstimateId] = useState("");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchedId, setSearchedId] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchEstimateId.trim()) return;
    
    setLoading(true);
    setError("");
    setVersions([]);
    setSearchedId(searchEstimateId.trim());

    try {
      const res = await axiosInstance.get(
        `/estimate/${searchEstimateId}/versions`
      );

      // 최신순으로 정렬
      const sortedVersions = [...res.data].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      );

      setVersions(sortedVersions);
    } catch (err) {
      setError("해당 견적서의 버전 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h2 className="fw-bold mb-4">📑 견적서 버전 목록 조회</h2>

      <div className="d-flex gap-2 mb-4">
        <input
          type="text"
          placeholder="견적서 번호 입력"
          value={searchEstimateId}
          onChange={(e) => setSearchEstimateId(e.target.value)}
          style={{
            width: "200px",
            padding: "8px",
            fontSize: "0.95rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            fontSize: "0.95rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          검색
        </button>
      </div>

      {loading && <p>버전 목록을 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {searchedId && !loading && (
        <>
          <h5>견적서 #{searchedId}의 버전 목록</h5>
          {versions.length === 0 ? (
            <p>저장된 버전이 없습니다.</p>
          ) : (
            <ul style={{ paddingLeft: "0", listStyle: "none" }}>
              {versions.map((version, index) => {
                const versionNumber = versions.length - index; // 오래된 버전이 1번
                return (
                  <li key={version.versionId} style={{ marginBottom: "16px" }}>
                    <Link
                      to={`/estimate-version/${version.versionId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                        }}
                      >
                        <strong>버전 {versionNumber}</strong> —{" "}
                        {version.memo || "메모 없음"}
                        <br />
                        <small className="text-muted">
                          저장자: {version.savedBy} / 저장일:{" "}
                          {new Date(version.savedAt).toLocaleString()}
                        </small>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default EstimateVersionList;
