import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

// EstimateVersionDetail.jsx 수정
const EstimateVersionDetail = () => {
  const { versionId } = useParams();
  const [versionData, setVersionData] = useState(null);
  const navigate = useNavigate();

  const handleEditVersion = () => {
    // versionData에서 estimateId를 추출해야 함
    const estimateId = versionData.estimateId; // 또는 다른 필드명

    navigate(`/estimate/${estimateId}/edit`, {
      state: { versionData: versionData },
    });
  };

  return (
    <div>
      <h2>버전 상세 정보</h2>
      <button onClick={handleEditVersion}>이 버전으로 편집하기</button>
      <pre>{JSON.stringify(versionData, null, 2)}</pre>
    </div>
  );
};

export default EstimateVersionDetail;
