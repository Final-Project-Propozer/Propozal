# Propozal (프로포잘)

이 문서는 Propozal 프로젝트를 위한 Git 및 GitHub 사용 가이드입니다.  
브랜치 기반 워크플로우를 통해 안정적인 협업과 코드 관리를 목표로 합니다.

---


### 브랜치 전략
- main : 배포용 브랜치 ( 절대 수정 금지 )
- dev : 개발 통합 브랜치
- feat/* : 기능 구현 브랜치
- 필요 시 bugfix/*, hotfix/*, refactor/* 등 사용 가능



### 📌 1. GitHub 저장소 클론하기 (최초 1회만)

#### ✅ 방법
- macOS: 터미널
- Windows: Git Bash 또는 GitHub CLI 추천

```bash
cd ~/Dev  # 원하는 폴더로 이동
git clone https://github.com/yeon47/CreationStack.git
```

⸻

## 📌 2. main에서 직접 작업하지 마세요!

❌ 금지된 방법:
```bash
git add .
git commit -m "수정함"
git push origin main   # 🚨 금지
```
👉 main은 항상 안정적인 상태를 유지해야 합니다.

⸻

## 📌 3. 새로운 브랜치에서 작업하기

### 브랜치 생성
```bash
git checkout -b feat/기능명
```

### 브랜치 관련 명령어
```bash
git branch                  # 현재 로컬 브랜치 목록 확인
git checkout 브랜치명        # 기존 브랜치로 이동
git checkout -              # 이전 브랜치로 되돌아가기
```

### 브랜치 이름 예시
```bash
feat/add-login
feat/improve-ui
bugfix/fix-login-error
```

⸻

## 📌 4. 변경 사항 저장 (커밋하기)

### 변경된 파일 확인
```bash
git status
```

### 스테이징
```bash
git add .
```

### 커밋
```bash
git commit -m "[Feature] 로그인 기능 추가"
```
✅ 커밋 컨벤션

```
[타입] 작업 내용 (간결하게)
```

| 타입 | 설명 |
|:----|:----|
| feat | 새로운 기능 추가 |
| fix | 버그 수정| 
| refactor | 코드 리팩토링 | 
| chore | 설정, 문서 등 작업| 
| style | 코드 포맷, 세미콜론, 공백 등 비기능적 변경|
| docs | 문서 작업|


✅ 커밋 메시지 예시:  
- `[fix] 로그인 오류 수정`  
- `[feat] 판매글 업로드 기능 추가`  
- `[chore] 폴더 구조 정리`

⸻

## 📌 5. 원격 저장소로 푸시하기

```bash
git push origin feat/작업이름
```


⸻

## 📌 6. Pull Request (PR) 생성하기

1. GitHub 저장소 → Pull Requests 클릭
2. "New Pull Request" 클릭
3. base: dev / compare: feat/작업이름 설정
4. 작업 설명 작성, 팀원에게 리뷰 요청
5. 승인 후 Merge

✅ PR 컨벤션 (PR 생성 시 자동 생성 )
```
[타입] 기능 요약 (브랜치명 기반)

## 💡 작업 개요
- 게시글 등록 기능 개발

## 🔧 작업 상세 내용
- 제목, 본문, 이미지 업로드 필드 포함한 게시글 등록 폼 구현
- DB에 post 데이터 저장 API 연동
- 예외처리 및 필드 유효성 검사

## 📌 기타 참고사항
- 태그 기능은 다음 브랜치에서 진행 예정
```

⸻

## 📌 7. 새로운 작업을 시작할 때 항상 develop 최신화!

```bash
git checkout dev          # 또는 git switch develop
git pull origin dev       # main이 아닌 develop 기준으로 최신화!
git checkout feat/my-task  # 또는 git switch -c feat/new-task

git pull origin dev      # 최신 develop 내용 병합 (필수!)
```


⸻

# 🚀 Git 협업 워크플로우 요약

| 단계 | 명령어 | 설명 |
|:----|:----|:----|
| 저장소 클론 | `git clone` | 로컬에 저장소 복제 |
| 새 브랜치 생성 | `git switch -c feature/작업이름` | 새 작업 브랜치 생성 |
| 변경사항 확인 | `git status` | 수정 파일 확인 |
| 변경사항 추가 | `git add .` | 스테이징 |
| 변경사항 커밋 | `git commit -m "메시지"` | 변경 저장 |
| 원격 저장소 푸시 | `git push origin feat/기능명` | GitHub 업로드 |
| PR 생성 및 병합 | GitHub에서 PR 생성 후 Merge |
| 새로운 작업 시작 전 최신화 | `git pull origin develop` | 항상 최신 develop 기준 |


⸻

# 🔥 Git 협업 시 주의할 점

✅ main 브랜치 직접 수정 금지  
✅ 작업 전 항상 최신 develop pull  
✅ 의미 있는 커밋 메시지 작성 (`feat`, `fix`, `chore` 등)  
✅ 브랜치 → PR → Merge 순서로 협업  

⸻
