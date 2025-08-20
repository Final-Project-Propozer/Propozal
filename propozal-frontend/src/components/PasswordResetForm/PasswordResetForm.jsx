import React, { useState } from 'react';
import { Button, Form, Card, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PasswordResetForm.css';

const PasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token"); // ✅ URL에서 토큰 추출

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Step 1: 메일 발송
  const handleSendEmail = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/password-reset/request', { email });
      alert('비밀번호 재설정 메일이 발송되었습니다. 이메일을 확인하세요.');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || '메일 발송 실패');
    }
  };

  // ✅ Step 2: 비밀번호 변경
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/password-reset/confirm', {
        token,
        newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || '비밀번호 변경 실패');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '3rem 1rem',
        backgroundColor: '#ffffff',
        minHeight: 'auto',
      }}
    >
      <Card
        style={{
          maxWidth: '500px',
          width: '100%',
          border: '1px solid #d6d2cb',
          borderRadius: '12px',
          padding: '2rem',
          backgroundColor: '#fff',
        }}
      >
        <Card.Body>
          <h3 className="mb-4 text-center fw-bold">비밀번호 재설정</h3>

          {/* ✅ Step 1: 토큰 없을 때 → 이메일 입력 */}
          {!token && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>이메일</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    placeholder="이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ border: '1px solid #d6d2cb', borderRadius: '8px' }}
                  />
                  <Button
                    className="code-btn"
                    style={{ backgroundColor: '#BDDFBC', color: '#000', fontSize: '0.9rem' }}
                    onClick={handleSendEmail}
                  >
                    메일 전송
                  </Button>
                </InputGroup>
              </Form.Group>
              <p className="text-muted">
                가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
              </p>
            </>
          )}

          {/* ✅ Step 2: 토큰이 있을 때 → 비밀번호 변경 */}
          {token && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>새 비밀번호</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="새 비밀번호 입력"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ border: '1px solid #d6d2cb', borderRadius: '8px' }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👀'}
                  </Button>
                </InputGroup>
                <Form.Text style={{ color: '#588157' }}>
                  비밀번호는 8자 이상이어야 합니다.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>비밀번호 확인</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호 재입력"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ border: '1px solid #d6d2cb', borderRadius: '8px' }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👀'}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                className="w-100 rounded-pill py-2 fw-semibold border-0"
                style={{ backgroundColor: '#198754', color: '#fff' }}
                onClick={handlePasswordChange}
              >
                비밀번호 변경
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PasswordReset;
