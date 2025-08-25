# 멋쟁이사자처럼 최종 프로젝트 - Propozal (프로포잘)

## Propozal 소개

<img width="1280" height="712" alt="image" src="https://github.com/user-attachments/assets/cd261aef-b98b-4921-b66b-2f2859cc3dcd" />

**데이터 기반의 견적생성 및 관리 시스템으로 영업사원이 현장에서 즉시 견적서를 생성하고 다운로드, 이메일 전송이 가능함으로서 체계적이고 전문적인 견적서 생성을 지원합니다.**

-----

## 조원 소개

| <img src="https://github.com/HyuckJun-Kwon.png" width="120px"> | <img src="https://github.com/MINJEJEKIM.png" width="120px"> | <img src="https://github.com/sihwan0816.png" width="120px"> | <img src="https://github.com/lold2424.png" width="120px"> | <img src="https://github.com/jaehyeonsin1.png" width="120px"> | <img src="https://github.com/RE4LN4ME.png" width="120px"> | <img src="https://github.com/Ahn-dev.png" width="120px"> | <img src="https://github.com/ssong7890.png" width="120px"> |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [**권혁준**](https://github.com/HyuckJun-Kwon) | [**김민제**](https://github.com/MINJEJEKIM) | [**김시환**](https://github.com/sihwan0816) | [**윤혜진**](https://github.com/lold2424) | [**신재현**](https://github.com/jaehyeonsin1) | [**최은수**](https://github.com/RE4LN4ME) | [**안성준**](https://github.com/Ahn-dev) | [**송지원**](https://github.com/ssong7890) |
| **백엔드** | **백엔드** | **백엔드** | **PM & 백엔드** | **DB & 백엔드** | **배포 & 백엔드** | **프론트** | **프론트** |

## 기술 스택

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"/>

 <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white"/> <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white"/> <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"/> <img src="https://img.shields.io/badge/JPA-E67E22?style=for-the-badge&logo=spring-data-jpa&logoColor=white"/> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/> <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white"/>

<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazonaws&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white"/>

<img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>

<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/> <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"/> <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/> <img src="https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white"/> <img src="https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>

## 기능

### 1. 견적 관리 (Estimate Management)

- 견적서 생성, 조회, 목록 확인 및 버전 관리 기능
- (Estimate, EstimateCreate, EstimateList, EstimateView, EstimateVersion)

### 2. 사용자 관리 (User Management)
- 일반 로그인 및 회원가입 기능
- (Login, Signup)

### 3. 판매 및 제품 관리 (Sales & Product Management)
- 판매 메인 페이지 및 제품 관리 기능
- (SalesMainPage, Product)

### 4. 고객 관리 (Customer Management)
- 고객 정보 관리 기능
- (Customer)

### 5. 일정 관리 (Scheduling)
- 일정 관련 기능
- (Schedule)

### 6. 관리자 기능 (Admin)
- 관리자 전용 페이지 및 기능
- (Admin, AdminTestPage.jsx)

### 7. 홈 (Home)
- 메인 랜딩 페이지
- (Home)

## 프로젝트 설정

### 프론트엔드 (Frontend)

- 핵심 프레임워크: React.js
  - 컴포넌트 기반 아키텍처를 통해 UI를 효율적으로 구축합니다.
- 빌드 도구: Vite
  - 빠른 개발 서버 구동과 번들링을 지원하여 개발 생산성을 높입니다.
- 주요 라이브러리:
  - Chart.js: 판매 데이터나 통계 등을 시각화하는 차트 기능을 위해 사용됩니다.
- 언어: JavaScript (JSX)

### 백엔드 (Backend)

- 핵심 프레임워크: Spring Boot (Java)
  - Java 21 버전을 기반으로 안정적이고 빠른 백엔드 서버를 구축합니다.
- 데이터베이스:
  - MySQL을 주 데이터베이스로 사용합니다.
  - Spring Data JPA를 통해 객체 지향적으로 데이터를 관리합니다.
- 인증/보안:
  - Spring Security와 JWT (JSON Web Token)를 결합하여 안전한 인증 및 인가 시스템을 구현합니다.
- 파일 처리 및 외부 연동:
  - AWS S3: 파일(이미지, 문서 등)을 저장하기 위한 클라우드 스토리지를 사용합니다.
  - Spring Mail: 이메일 발송 기능을 구현합니다.
- 개발 도구:
  - Lombok: 반복적인 코드를 줄여 코드 가독성과 생산성을 향상시킵니다.
- 빌드 도구: Gradle
  - 의존성 관리 및 프로젝트 빌드를 담당합니다.

### 배포 및 운영 (DevOps)

- 컨테이너화: Docker (`Dockerfile`)
  - 애플리케이션을 컨테이너 환경에서 실행할 수 있도록 설정되어 있어 배포 일관성을 유지합니다.
- CI/CD: Jenkins (`Jenkinsfile`)
  - 코드 변경 시 자동으로 빌드, 테스트, 배포를 수행하는 파이프라인이 구축되어 있습니다.
