---
title: "CCAF 101"
---

# CCAF 101

Claude Certified Architect - Foundations 시험을 준비하기 위한 한국어 학습 위키입니다. 출제 구조와 도메인별 판단 포인트를 빠르게 복습할 수 있도록 정리했습니다.

## 시작하기

- [[exam-overview|Exam Overview]] — 시험 구조, 시나리오, 도메인 비중, 준비 우선순위
- 가장 비중이 큰 [[domains/01-agent-architecture-and-orchestration|D1 에이전트 아키텍처]]부터 잡는 것을 추천합니다

## 도메인

| 도메인 | 비중 | 핵심 키워드 |
|--------|------|------------|
| [D1. 에이전트 아키텍처](domains/01-agent-architecture-and-orchestration) | 27% | 에이전트 루프, 훅, 태스크 오케스트레이션 |
| [D2. 도구 설계와 MCP](domains/02-tool-design-and-mcp-integration) | 18% | 도구 설명, MCP, 도구 선택, 에러 처리 |
| [D3. Claude Code 워크플로](domains/03-claude-code-configuration-and-workflows) | 20% | CLAUDE.md, rules, commands, plan mode |
| [D4. 구조화된 출력](domains/04-prompt-engineering-and-structured-output) | 20% | 스키마 신뢰성, few-shot, 검증 루프 |
| [D5. 문맥 관리와 신뢰성](domains/05-context-management-and-reliability) | 15% | 문맥 압축, 출처 매핑, 에스컬레이션 |

## 개념 카탈로그

개념 문서는 도메인을 가로지르는 반복 출제 판단 축입니다. 도메인 본문에서 `[[개념명]]`으로 연결되어 있고, 오른쪽 Graph view에서 연결 관계를 시각적으로 확인할 수 있습니다.

### Agent Control

- [[concepts/agent-control/agent-loop|Agent Loop]] — 완료될 때까지 판단과 실행을 반복하는 구조
- [[concepts/agent-control/coordinator-subagent|Coordinator / Subagent]] — 허브-앤-스포크 멀티 에이전트 구조
- [[concepts/agent-control/hooks-and-enforcement|Hooks & Enforcement]] — 프롬프트 지시 vs 코드 수준 강제
- [[concepts/agent-control/task-decomposition|Task Decomposition]] — 작업을 어떤 경계로 나눌지 설계하는 방법
- [[concepts/agent-control/plan-mode-and-execution-control|Plan Mode & Execution Control]] — 실행을 보류하고 먼저 정렬하는 시점

### Tool & Interface

- [[concepts/tool-design/tool-interface-design|Tool Interface Design]] — 모델이 도구를 이해하는 방식 설계
- [[concepts/tool-design/tool-selection-and-disambiguation|Tool Selection & Disambiguation]] — 여러 도구 사이 경계를 나누는 기준
- [[concepts/tool-design/tool-safety-boundaries|Tool Safety Boundaries]] — capability 노출 조건 설계
- [[concepts/tool-design/mcp-integration|MCP Integration]] — 도구 생태계를 런타임에 일관되게 연결
- [[concepts/tool-design/structured-outputs-and-error-design|Structured Outputs & Error Design]] — 도구 결과를 행동 신호로 설계

### State & Memory

- [[concepts/state-memory/session-management|Session Management]] — 문맥을 이어가고 끊을지 판단하는 기준
- [[concepts/state-memory/context-lifecycle-management|Context Lifecycle Management]] — 문맥의 생성·유지·폐기 흐름
- [[concepts/state-memory/compression-without-losing-meaning|Compression Without Losing Meaning]] — 정보 밀도를 유지하며 축약
- [[concepts/state-memory/source-grounded-context-and-citation-fidelity|Source-grounded Context & Citation Fidelity]] — 출처 기반 문맥과 인용 정확성
- [[concepts/state-memory/scratchpads-working-memory-and-external-state|Scratchpads, Working Memory & External State]] — 작업 메모리와 외부 상태 관리

### Output Design

- [[concepts/output-design/structured-output-as-contract|Structured Output as Contract]] — 출력을 계약으로 보는 관점
- [[concepts/output-design/schema-design-for-reliability|Schema Design for Reliability]] — 스키마로 검증과 출력 유도를 동시에
- [[concepts/output-design/few-shot-patterns-for-output-consistency|Few-shot Patterns for Output Consistency]] — 예시 설계로 출력 일관성 확보
- [[concepts/output-design/batch-generation-strategy|Batch Generation Strategy]] — 처리량과 품질의 균형
- [[concepts/output-design/human-readable-vs-machine-usable-outputs|Human-readable vs Machine-usable Outputs]] — 사람용 vs 시스템용 출력 구분

### Execution & Safety

- [[concepts/execution-safety/validation-repair-and-retry-loops|Validation, Repair & Retry Loops]] — 출력 실패를 검증·복구·재생성으로 처리
- [[concepts/execution-safety/reliability-patterns-for-long-running-agents|Reliability Patterns for Long-running Agents]] — 장기 실행 안정성 패턴
- [[concepts/execution-safety/escalation-and-handoff-boundaries|Escalation & Handoff Boundaries]] — 에스컬레이션 시점과 인수인계 경계
- [[concepts/execution-safety/ci-guardrails-and-review-boundaries|CI, Guardrails & Review Boundaries]] — 종료 조건과 신뢰 경계
- [[concepts/execution-safety/rules-as-operational-memory|Rules as Operational Memory]] — 반복 판단을 규칙으로 외부화
- [[concepts/execution-safety/team-conventions-and-reproducibility|Team Conventions & Reproducibility]] — 팀 일관성과 재현 가능성
- [[concepts/execution-safety/coding-workflow-design|Coding Workflow Design]] — 읽기·계획·수정·검증·검토 루프
- [[concepts/execution-safety/claude-md-and-instruction-hierarchy|CLAUDE.md & Instruction Hierarchy]] — 규칙 출처와 우선순위

## 추천 읽기 순서

1. [[exam-overview|Exam Overview]]로 전체 시험 구조를 잡는다
2. [[domains/01-agent-architecture-and-orchestration|D1]]과 [[domains/03-claude-code-configuration-and-workflows|D3]]부터 — 가장 높은 비중
3. [[domains/02-tool-design-and-mcp-integration|D2]]를 이어서 — 도구 설계와 MCP
4. [[domains/04-prompt-engineering-and-structured-output|D4]]와 [[domains/05-context-management-and-reliability|D5]]를 묶어서 — 출력 신뢰성 + 장기 실행

> **도메인 문서는 시험 범위를 잡는 지도이고, 개념 문서는 반복 출제되는 판단 축을 세우는 뼈대다.**

## 인포그래픽

빠른 복습을 위한 보조 요약 자료입니다.

- [시험 개요](assets/images/infographics/00-overview.png)
- [D1. 에이전트 아키텍처](assets/images/infographics/01-agent-architecture.png)
- [D2. 도구 설계와 MCP](assets/images/infographics/02-tool-design-mcp.png)
- [D3. Claude Code 워크플로](assets/images/infographics/03-claude-code-workflows.png)
- [D4. 구조화된 출력](assets/images/infographics/04-structured-output.png)
- [D5. 문맥 관리와 신뢰성](assets/images/infographics/05-context-reliability.png)

> [!note] 참고
> 이 사이트의 내용은 AI를 활용해 번역하고 정리했습니다. 중요한 해석과 최종 판단은 공식 문서와 함께 다시 확인하는 것을 권장합니다.
