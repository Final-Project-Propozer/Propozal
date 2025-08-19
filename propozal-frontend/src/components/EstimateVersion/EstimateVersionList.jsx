import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const EstimateVersionList = () => {
  const { estimateId } = useParams();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await axiosInstance.get(`/api/estimate/${estimateId}/versions`);
        setVersions(res.data);
      } catch (error) {
        console.error('버전 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [estimateId]);

  if (loading) return <p>버전 목록을 불러오는 중...</p>;

  return (
    <div>
      <h2>견적서 {estimateId}의 버전 목록</h2>
      {versions.length === 0 ? (
        <p>저장된 버전이 없습니다.</p>
      ) : (
        <ul>
          {versions.map((version, index) => (
            <li key={version.versionId} style={{ marginBottom: '12px' }}>
              <Link to={`/estimate-version/${version.versionId}`}>
                <strong>버전 {index + 1}</strong> — {version.memo || '메모 없음'}
                <br />
                <small>
                  저장자: {version.savedBy} / 저장일:{' '}
                  {new Date(version.savedAt).toLocaleString()}
                </small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EstimateVersionList;
