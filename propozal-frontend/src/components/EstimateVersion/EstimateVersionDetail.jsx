import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const EstimateVersionDetail = () => {
  const { versionId } = useParams();
  const [versionData, setVersionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersionDetail = async () => {
      try {
        const res = await axiosInstance.get(`/api/estimate/versions/${versionId}`);
        setVersionData(res.data); // ✅ JSON.parse 제거
      } catch (error) {
        console.error('상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersionDetail();
  }, [versionId]);

  if (loading) return <p>상세 정보를 불러오는 중...</p>;
  if (!versionData) return <p>해당 버전을 찾을 수 없습니다.</p>;

  return (
    <div>
      <h2>버전 상세 정보 - 특정 버전 상세 데이터 불러오기</h2>
      <pre>{JSON.stringify(versionData, null, 2)}</pre>
    </div>
  );
};

export default EstimateVersionDetail;
