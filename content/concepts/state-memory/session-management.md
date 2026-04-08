---
title: "Session Management"
tags:
  - state-memory
  - domain-1
---

# Session Management

> 이 문서는 CCAF Domain 1을 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 session management를 단순한 편의 기능이 아니라, **에이전트가 어떤 문맥을 유지하고 어떤 문맥을 버릴지 결정하는 운영 기술**로 이해하는 데 초점을 둔다.

## Session management란 무엇인가

[[concepts/agent-control/agent-loop|Agent Loop]]를 실행하는 에이전트 시스템에서 session은 단순한 채팅 기록이 아니다.  
실제로는:

- 지금까지의 대화 맥락
- 이미 수행한 작업
- 이전 도구 호출 결과
- 현재 작업 흐름의 상태

를 함께 담는 실행 컨테이너에 가깝다.

즉 session management는:

> **어떤 상태를 이어가고, 어떤 상태를 끊고, 언제 새 출발을 할지를 결정하는 일**

이다.

---

## 왜 session management가 중요한가

문맥을 계속 유지하면 편하다.  
이전 대화와 작업 상태를 그대로 이어갈 수 있기 때문이다.

하지만 문맥 유지가 항상 좋은 것은 아니다.  
시간이 지나면 다음 문제가 생길 수 있다.

- 오래된 요구사항이 현재 작업을 오염시킨다
- 예전 결론이 아직도 유효하다고 잘못 가정한다
- stale한 tool result를 계속 믿는다
- 너무 많은 대화 이력이 attention budget을 잡아먹는다

즉 session은 기억을 제공하지만,
동시에 **오염된 기억**도 함께 들고 간다.

그래서 session management의 핵심은:

> **기억을 오래 유지하는 것보다, 어떤 기억이 아직 유효한지 계속 판단하는 것**

에 있다.

---

## Fresh start와 Resume는 어떻게 다른가

이 구분은 session management의 핵심이다.

### Fresh start
완전히 새 세션에서 시작하는 방식이다.

장점:
- 오래된 문맥 오염을 끊을 수 있다
- stale state를 초기화할 수 있다
- 새로운 문제를 독립적으로 다루기 쉽다

단점:
- 이전에 축적한 맥락을 잃는다
- 다시 설명해야 할 내용이 많아질 수 있다

### Resume
기존 세션을 이어서 사용하는 방식이다.

장점:
- 기존 작업 흐름을 유지할 수 있다
- 반복 설명이 줄어든다
- 긴 작업을 자연스럽게 이어갈 수 있다

단점:
- 쌓인 문맥이 오히려 방해가 될 수 있다
- 예전 전제가 현재에도 맞다고 착각할 수 있다

즉 두 방식의 차이는 단순한 편의성 문제가 아니라,

> **문맥 유지의 이점과 문맥 오염의 비용 사이에서 균형을 잡는 문제**

다.

---

## Session carryover는 왜 조심해야 하는가

기존 세션을 이어가면 편하지만,
carryover에는 항상 위험이 있다.

예를 들면:
- 이미 바뀐 파일 상태를 예전 상태로 기억하거나
- 끝난 TODO를 아직 진행 중으로 간주하거나
- 예전 tool output을 최신 사실처럼 취급하거나
- 다른 작업의 톤과 목적이 새 작업에 섞이는 경우

이런 문제는 겉보기에 사소해 보여도,
실제로는 에이전트 품질을 크게 떨어뜨린다.

그래서 중요한 것은:
- 세션을 무조건 유지하는 것이 아니라
- **무엇이 아직 유효한지 점검하면서 이어가는 것**

이다.

---

## stale context와 stale tool result는 어떻게 다른가

둘은 비슷해 보이지만 구분하는 편이 좋다.

### stale context
대화나 전제 자체가 오래된 경우다.

예:
- “우리는 아직 이 작업을 시작 안 했어”
- “이 설정은 아직 안 바뀌었어”
- “이 문서는 아직 초안 상태야”

같은 전제가 더 이상 맞지 않는 경우

### stale tool result
도구가 반환한 결과가 더 이상 최신이 아닌 경우다.

예:
- 예전 `git status`
- 오래된 CI 결과
- 몇 시간 전 로그
- 이전 파일 내용

즉 stale context는 **생각의 오염**에 가깝고,  
stale tool result는 **관찰값의 노후화**에 가깝다.

둘 다 위험하지만, 특히 tool result는
“한 번 확인했으니 맞겠지”라는 착각을 부르기 쉽다.

---

## fork_session, resume, compact 같은 조작은 왜 필요한가

세션을 다루는 조작은 결국 문맥 수명주기를 통제하기 위한 수단이다.

### resume
기존 흐름을 계속 이어갈 때 유용하다.  
긴 작업, 장기 편집, 여러 차례 수정이 필요한 업무에 잘 맞는다.

### fork_session
기존 문맥을 참고하되,
그 위에서 다른 방향의 실험이나 검토를 분리하고 싶을 때 유용하다.

즉 fork는:

> **기억은 가져가되, 흐름은 분기하는 방법**

이다.

### compact
문맥을 완전히 버리지는 않되,
핵심만 압축해 attention 부담을 줄이는 방식이다. [[concepts/state-memory/compression-without-losing-meaning|Compression without Losing Meaning]]과 직접 관련된다.

즉 compact는:

> **연속성은 유지하면서 문맥 부피를 줄이는 절충안**

이다.

---

## 언제 새로 시작해야 하고, 언제 이어가야 하는가

실무적으로는 아래 기준이 유용하다.

### 새로 시작하는 편이 나은 경우
- 작업 목적이 크게 바뀌었다
- 예전 대화가 오히려 방해된다
- stale tool result가 많다
- 문맥이 너무 비대해졌다
- 완전히 다른 톤/역할/목표가 필요하다

### 이어가는 편이 나은 경우
- 같은 문제를 연속적으로 다루고 있다
- 이전 결론과 중간 산출물이 여전히 유효하다
- 작업 상태를 유지하는 것이 중요하다
- 긴 편집/디버깅/조사 흐름이 계속되고 있다

핵심은 단순하다.

> **연속성이 가치가 클 때는 이어가고, 오염 비용이 커졌을 때는 끊어라.**

---

## Session management의 핵심은 “기억”보다 “판단”이다

많은 사람이 session management를
“얼마나 많이 기억하느냐” 문제로 생각한다.

하지만 실제로 더 중요한 것은:

- 무엇을 계속 들고 갈지
- 무엇을 버릴지
- 무엇을 다시 확인해야 할지
- 어느 시점에 fresh start가 더 나은지

를 판단하는 일이다.

즉 좋은 session management는 단순한 메모리 유지가 아니라,

> **문맥의 유효기간을 계속 평가하는 운영 습관**

에 가깝다.

---

## 런타임 관점에서 보면

OpenClaw 같은 런타임에서 session management는 단순한 채팅 UX가 아니라,
**문맥 수명주기를 통제해 실행 신뢰성을 유지하는 메커니즘**에 가깝다.

즉 핵심은:
- 어떤 세션을 이어갈지
- 어디서 분기할지
- 언제 압축할지
- 무엇을 다시 조회할지

를 계속 판단하는 데 있다.

---

## 흔한 오해

### “세션은 길수록 좋다”
아니다. 긴 세션은 풍부한 맥락을 주지만,
동시에 stale context와 attention burden도 함께 키운다.

### “한 번 도구로 확인한 결과는 계속 믿어도 된다”
그렇지 않다. tool result는 빠르게 stale해질 수 있다.

### “새 세션을 열면 항상 손해다”
그것도 아니다. 어떤 경우에는 fresh start가 오히려 정확도를 높인다.

---

## 한 문장 요약

> **Session management는 문맥을 무조건 오래 유지하는 기술이 아니라, 어떤 상태를 이어가고 어떤 상태를 버릴지 판단해 에이전트의 문맥 품질을 유지하는 방법이다.**

---

## 관련 개념

- [[concepts/agent-control/agent-loop|Agent Loop]]
- [[concepts/agent-control/coordinator-subagent|Coordinator / Subagent]]
- [[concepts/agent-control/task-decomposition|Task Decomposition]]
- [[concepts/state-memory/context-lifecycle-management|Context Lifecycle Management]] — 문맥 수명주기 전반
- [[concepts/state-memory/scratchpads-working-memory-and-external-state|Scratchpads & Working Memory]] — 세션 외부에 상태를 저장하는 패턴
- [[concepts/execution-safety/reliability-patterns-for-long-running-agents|Reliability Patterns for Long-running Agents]] — 긴 세션의 신뢰성 유지
