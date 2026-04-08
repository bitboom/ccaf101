---
title: "Coordinator / Subagent"
tags:
  - agent-control
  - domain-1
---

# Coordinator / Subagent

> 이 문서는 CCAF Domain 1을 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 멀티 에이전트 구조를 단순한 “여러 agent”가 아니라, **coordinator가 작업을 구조화하고 subagent가 제한된 문맥 안에서 실행하는 시스템**으로 이해하는 데 초점을 둔다.

## Coordinator / Subagent란 무엇인가

복잡한 문제를 하나의 agent가 한 번에 처리하기 어려울 때, 역할을 나눠 여러 실행 단위로 다루는 구조가 필요해진다. 이때 중심이 되는 agent가 **Coordinator**이고, 개별 하위 작업을 맡는 agent가 **Subagent**다.

가장 단순하게 표현하면 다음과 같다.

- **Coordinator**: 문제를 나누고, 작업을 배정하고, 결과를 다시 합친다
- **Subagent**: 맡겨진 범위 안에서 실행하고, 결과나 오류를 반환한다

즉 멀티 에이전트 구조의 핵심은 agent 수가 아니라,  
**역할 분리와 책임 있는 재통합**이다. 이 구조는 [[concepts/agent-loop|Agent Loop]]를 역할별로 나눈 것으로 이해할 수 있다.

---

## 왜 이 구조가 필요한가

큰 문제를 하나의 agent에게 그대로 던지면,
- 문맥이 과도하게 길어지고
- 서로 다른 관점을 동시에 유지해야 하고
- 중요한 하위 문제를 놓치거나
- attention이 분산될 수 있다

이럴 때 작업을 적절히 나누면 각 실행 단위가 더 좁고 명확한 범위에 집중할 수 있다.  
하지만 중요한 건 단순 분업이 아니다.

> **멀티 에이전트 시스템의 품질은 subagent 수보다 coordinator의 framing과 synthesis 품질에 더 크게 좌우된다.**

즉 잘 나누는 것만큼, **잘 다시 합치는 것**이 중요하다.

---

## Coordinator의 책임은 무엇인가

Coordinator는 단순한 라우터가 아니다.  
실제로는 전체 흐름을 책임지는 **오케스트레이터**에 가깝다.

주요 책임은 다음과 같다.

1. 문제를 구조적으로 나눈다
2. 어떤 subagent에게 어떤 작업을 맡길지 정한다
3. 작업에 필요한 문맥과 제약을 함께 전달한다
4. subagent 결과를 모은다
5. 결과의 충돌, 누락, 품질을 평가한다
6. 필요하면 다시 재위임한다
7. 최종 응답이나 최종 산출물을 결정한다

즉 Coordinator는:
- 계획자
- 브리핑 담당자
- 편집자
- 품질 관리자

역할을 모두 가진다.

한 문장으로 줄이면:

> **Coordinator는 멀티 에이전트 시스템의 판단자이자 편집자다.**

---

## Subagent의 책임은 무엇인가

Subagent는 좁고 명확한 범위를 맡아 실행하는 agent다.  
핵심은 **작업 범위를 줄여 집중도를 높이는 것**이다.

예를 들면:
- 특정 문서만 읽고 핵심 주장 정리
- 특정 파일 집합만 분석
- 특정 주제에 대한 자료 조사
- 특정 오류에 대한 로그 분석

Subagent의 책임은 단순하다.

- 맡은 범위 안에서 실행한다
- 결과를 구조화해서 반환한다
- 실패했다면 실패 원인과 partial result를 함께 보고한다

즉 subagent는 독립적인 실행 단위이지만,  
전체 전략을 다시 짜는 주체는 아니다.

---

## 왜 context를 자동 상속하면 안 되는가

이 페이지에서 가장 중요한 포인트 중 하나가 이거다.

Subagent는 coordinator의 전체 대화 히스토리를 자동으로 물려받는 존재가 아니다.  
필요한 정보는 **명시적으로 전달**해야 한다.

이 설계가 중요한 이유는:
- 쓸데없는 긴 문맥을 줄이고
- 작업 범위를 선명하게 하고
- 필요한 근거와 출처를 분리해서 주고
- 결과 품질을 높이기 위해서다

즉 컨텍스트는 공기처럼 퍼지는 게 아니라,

> **택배처럼 보내야 한다.**

좋은 context passing은 그냥 긴 설명을 복붙하는 게 아니다.  
보통은 아래 요소를 구조화해서 넘기는 편이 좋다.

- 작업 목표
- 입력 자료
- 필요한 제약
- 출력 형식
- source metadata

예를 들어:
- 문서 URL
- 발췌문
- 파일 경로
- 관련 line number
- page number
- prior findings

같은 정보를 구조화해서 넘기면, subagent는 더 정확한 범위 안에서 일할 수 있다.

한 문장으로 줄이면:

> **Subagent 품질은 자율성보다 coordinator가 작업, 문맥, 기대 출력 형식을 얼마나 선명하게 설계하느냐에 더 크게 좌우된다.**

---

## 결과는 어떻게 다시 합쳐야 하는가

멀티 에이전트 구조의 진짜 어려움은 분해보다 **합치기(synthesis)**다.

Coordinator는 subagent 결과를 단순히 이어붙이면 안 된다.  
보통은 아래 단계를 거친다.

1. 각 결과의 범위와 품질 확인
2. 충돌하는 주장이나 누락 확인
3. 필요한 경우 재위임
4. 최종 답변이나 보고서로 통합

즉 좋은 synthesis는:
- aggregation
- comparison
- gap detection
- refinement

을 포함한다.

그래서 coordinator는 단순 collector가 아니라,  
**결과를 다시 해석하고 편집하는 계층**이 된다.

---

## Iterative refinement는 왜 중요한가

첫 번째 라운드 결과가 항상 충분한 것은 아니다.

예를 들어:
- 하위 조사 하나가 빈약할 수 있고
- 서로 충돌하는 결과가 나올 수 있고
- 빠진 범위가 있을 수 있다

이때 coordinator는:
- 한번 합쳐보고
- 빈틈을 찾고
- 다시 필요한 subagent를 띄우고
- 다시 합칠 수 있어야 한다

즉 멀티 에이전트 구조는
한 번 쪼개고 끝나는 게 아니라,

> **분해 → 실행 → 합성 → 재분해 → 재합성**

의 반복이 될 수 있다.

---

## 실패는 어떻게 다뤄야 하는가

좋은 멀티 에이전트 시스템에서는 subagent가 실패를 숨기면 안 된다.  
빈 결과를 성공처럼 돌려주는 것은 특히 위험하다.

Subagent는 가능하면 아래를 함께 반환해야 한다.

- failure type
- 무엇을 시도했는지
- 어디서 막혔는지
- partial result가 있는지
- 다음 대안이 있는지

그래야 coordinator가:
- 재시도할지
- 다른 subagent에 넘길지
- 결과를 보수적으로 종합할지
결정할 수 있다.

즉 structured error propagation도 멀티 에이전트 품질의 일부다. 이는 [[concepts/structured-outputs-and-error-design|Structured Outputs & Error Design]]과 직접 연결되는 주제다.

---

## OpenClaw 같은 런타임에서는 어떻게 보이는가

OpenClaw 같은 런타임에서도 핵심은 같다.

- 상위 실행 단위가 coordination을 맡고
- 하위 세션/서브 실행 단위가 개별 작업을 수행하고
- 결과는 다시 상위 문맥으로 돌아와 종합된다

즉 런타임이 달라도 본질은 같다.

> **Coordinator가 구조를 만들고, subagent가 좁은 범위에서 실행하며, 결과는 다시 상위 계층에서 의미를 얻는다.**

---

## 실무에서 왜 중요한가

이 개념을 이해하면 아래가 명확해진다.

- 왜 큰 문제를 무작정 하나의 agent에 던지면 안 되는가
- 왜 subagent는 context를 자동 상속하면 안 되는가
- 왜 synthesis 품질이 멀티 에이전트 품질을 좌우하는가
- 왜 error propagation이 구조화되어야 하는가
- 왜 멀티 에이전트의 핵심은 수가 아니라 책임 구조인가

즉 멀티 에이전트의 핵심은 단순 병렬화가 아니라,  
**책임 분리와 재통합 설계**다.

---

## 자주 하는 오해

### 오해 1. Subagent는 coordinator의 문맥을 자동으로 안다
필요한 정보는 명시적으로 전달해야 한다.

### 오해 2. Coordinator는 단순히 결과를 모으기만 하면 된다
평가, 비교, 보완, 재위임까지 책임진다.

### 오해 3. Subagent가 많을수록 무조건 좋다
너무 잘게 쪼개면 오히려 조정 비용이 늘고 중요한 연결을 놓칠 수 있다.

---

## 한 문장 요약

> **Coordinator / Subagent 구조는 복잡한 문제를 역할별로 분해하고, 하위 실행 결과를 다시 종합하기 위해 사용하는 멀티 에이전트 패턴이며, 핵심은 문맥의 명시적 전달과 결과의 책임 있는 재통합이다.**

---

## 관련 개념

- [[concepts/agent-loop|Agent Loop]] — coordinator와 subagent 모두 내부적으로 agent loop를 실행한다
- [[concepts/task-decomposition|Task Decomposition]] — coordinator가 문제를 나누는 방법론
- [[concepts/session-management|Session Management]] — 하위 세션 관리와 문맥 수명주기
- [[concepts/escalation-and-handoff-boundaries|Escalation & Handoff Boundaries]] — subagent가 처리할 수 없는 문제의 상위 위임

## 더 읽어보기

### Anthropic
- Building Effective Agents  
  <https://www.anthropic.com/engineering/building-effective-agents>
- Multi-Agent Research System  
  <https://www.anthropic.com/engineering/multi-agent-research-system>

### OpenClaw
- OpenClaw GitHub Repository  
  <https://github.com/openclaw/openclaw>
