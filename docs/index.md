<section class="home-hero">
  <p class="eyebrow">CCAF STUDY NOTES</p>
  <h1>CCAF 101</h1>
  <p class="lead">
    Claude Certified Architect - Foundations 시험을 준비하기 위한 한국어 학습 노트입니다.
  </p>
  <p>
    공식 문서를 대체하려는 사이트가 아니라, 시험 구조와 도메인별 판단 포인트를 빠르게 복습하기 위한 정리본으로 구성했습니다.
  </p>
</section>

## 어디서 시작할지

<div class="home-grid">
  <a class="home-card" href="exam-overview/">
    <strong>시험 개요</strong>
    <span>시험 구조, 시나리오, 도메인 비중, 준비 우선순위를 먼저 정리합니다.</span>
  </a>
  <a class="home-card" href="domains/01-agent-architecture-and-orchestration/">
    <strong>D1. 에이전트 아키텍처</strong>
    <span>가장 비중이 큰 영역입니다. 에이전트 루프, 멀티 에이전트 구조, 훅 설계부터 먼저 잡는 편이 좋습니다.</span>
  </a>
  <a class="home-card" href="domains/03-claude-code-configuration-and-workflows/">
    <strong>D3. Claude Code 워크플로</strong>
    <span>Claude Code 운영 방식, 규칙 파일 구조, plan mode, 팀 워크플로에서 자주 헷갈리는 포인트를 다룹니다.</span>
  </a>
</div>

## 도메인별 문서

<div class="home-grid">
  <a class="home-card" href="domains/01-agent-architecture-and-orchestration/">
    <strong>D1. 에이전트 아키텍처</strong>
    <span>27% · 에이전트 루프, 훅, 태스크 오케스트레이션, `fork_session`</span>
  </a>
  <a class="home-card" href="domains/02-tool-design-and-mcp-integration/">
    <strong>D2. 도구 설계와 MCP</strong>
    <span>18% · 도구 설명, MCP, 도구 선택, 에러 처리</span>
  </a>
  <a class="home-card" href="domains/03-claude-code-configuration-and-workflows/">
    <strong>D3. Claude Code 워크플로</strong>
    <span>20% · CLAUDE.md, rules, commands, plan mode, CI/CD</span>
  </a>
  <a class="home-card" href="domains/04-prompt-engineering-and-structured-output/">
    <strong>D4. 구조화된 출력</strong>
    <span>20% · 스키마 신뢰성, few-shot 예시, 검증 루프, batch 처리</span>
  </a>
  <a class="home-card" href="domains/05-context-management-and-reliability/">
    <strong>D5. 문맥 관리와 신뢰성</strong>
    <span>15% · 문맥 압축, 출처 매핑, 에스컬레이션, 스크래치패드</span>
  </a>
</div>

## 추천 읽기 순서

1. [시험 개요](exam-overview.md)로 전체 시험 구조와 출제 시나리오를 먼저 잡습니다.
2. [D1](domains/01-agent-architecture-and-orchestration.md)과 [D3](domains/03-claude-code-configuration-and-workflows.md)부터 읽어 가장 높은 비중 구간을 선점합니다.
3. [D2](domains/02-tool-design-and-mcp-integration.md)를 이어서 읽고 도구 설계와 MCP 판단 기준을 붙입니다.
4. [D4](domains/04-prompt-engineering-and-structured-output.md)와 [D5](domains/05-context-management-and-reliability.md)를 묶어 출력 신뢰성과 장기 실행 안정성을 같이 복습합니다.
