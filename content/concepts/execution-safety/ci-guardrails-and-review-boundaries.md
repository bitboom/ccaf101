---
title: "CI, Guardrails & Review Boundaries"
tags:
  - execution-safety
  - domain-3
---

# CI, Guardrails & Review Boundaries

> 이 문서는 CCAF Domain 3를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 작업 루프 일반론보다, **Claude Code의 결과가 어디서 신뢰 가능해지고 어디서 멈추고 어디서 인간 판단으로 넘어가야 하는가**를 다룬다. 즉 CI, guardrails, review boundaries를 단순한 사후 검사 절차가 아니라, **작업 종료 조건과 신뢰 경계를 정하는 계층**으로 이해하는 데 초점을 둔다.

## 왜 이 경계가 중요한가

Claude Code는 코드를 빠르게 읽고 수정할 수 있다.  
하지만 빠르게 수정할 수 있다는 사실과,  
그 변경이 곧바로 신뢰 가능하다는 사실은 다르다.

실제로 중요한 것은:
- 어떤 변경은 자동 검증만으로 충분한지
- 어떤 변경은 더 강한 가드레일이 필요한지
- 어디서 인간 리뷰가 반드시 들어와야 하는지
- 무엇을 작업 종료 조건으로 볼지

를 정하는 일이다.

즉 핵심은 단순히 “테스트를 돌린다”가 아니라,

> **모델 산출물이 어떤 신뢰 경계를 통과해야 하는가**

다.

---

## CI는 무엇을 해주는가

CI는 Claude Code의 결과를 자동으로 검증하는 기본 경로다.  
보통 여기에는:

- 테스트 실행
- lint
- typecheck
- 빌드 검증
- 형식 검사
- 정책 검사

같은 것들이 들어간다.

중요한 점은 CI가 단순한 편의 기능이 아니라,

> **로컬에서 그럴듯해 보이는 수정과 실제로 merge 가능한 변경을 구분하는 필터**

라는 점이다.

즉 로컬 성공은 시작일 수 있지만,  
CI 통과는 훨씬 강한 신뢰 신호다.

---

## guardrail은 무엇을 뜻하는가

guardrail은 모델이 잘못된 방향으로 너무 멀리 가기 전에 막거나 되돌리거나 확인하게 만드는 장치다.

예를 들면:
- 위험한 파일 수정 금지
- 특정 디렉토리 변경 시 추가 검증
- 파괴적 명령 전 확인 ([[concepts/agent-control/hooks-and-enforcement|hooks]]로 구현 가능)
- 테스트 실패 시 다음 단계 차단
- 중요한 작업 전 인간 승인 요구 ([[concepts/execution-safety/escalation-and-handoff-boundaries|escalation]])

즉 guardrail은 단순 경고가 아니라,

> **작업 루프 안에 삽입된 제약과 차단 장치**

에 가깝다.

---

## review boundary는 왜 별도로 중요할까

자동 검증이 강해도,  
모든 판단을 CI가 대신할 수는 없다.

예를 들어:
- 제품 의도에 맞는가
- 사용자 경험이 나아졌는가
- 구조 변경이 팀 아키텍처 방향과 맞는가
- 민감한 비즈니스 규칙을 제대로 해석했는가

이런 것은 여전히 인간 리뷰가 더 적합하다.

즉 review boundary는:

> **자동 검증이 충분한 지점과, 인간 판단이 필요한 지점을 구분하는 경계**

다.

좋은 workflow는 이 경계를 흐리지 않는다.

---

## 로컬 성공과 mergeable state는 어떻게 다른가

이 구분은 실무적으로 중요하다.

### 로컬 성공
- 수정이 끝나 보임
- 간단한 확인은 통과
- 작성자는 문제없어 보인다고 느낌

### mergeable state
- 필요한 자동 검증을 통과함
- [[concepts/execution-safety/team-conventions-and-reproducibility|팀 규약]]과 저장소 규칙에 맞음
- 리뷰 가능한 diff를 가짐
- 인간 검토가 필요한 경우 그 경계를 통과할 준비가 됨

즉 mergeable state는 단순히 코드가 돌아가는 상태가 아니라,

> **팀의 신뢰 경계를 통과할 준비가 된 상태**

를 뜻한다.

---

## 작업 종료 조건은 왜 중요한가

Claude Code가 수정안을 만들었다고 해서 작업이 끝난 것은 아니다.  
정말 중요한 질문은:

- 테스트를 통과했는가
- 필요한 검증을 마쳤는가
- review boundary에 도달했는가
- 사람이 봐야 할 작업이면 그 지점까지 정리됐는가

이다.

즉 좋은 운영에서 작업 종료 조건은  
“모델이 답을 냈다”가 아니라,

> **신뢰 경계를 통과했거나, 다음 검토 경계까지 안전하게 도달했다**

가 되어야 한다.

---

## 왜 이게 harness engineering과 맞닿는가

이 파트는 가장 직접적으로 harness engineering과 연결된다.

좋은 하니스는 모델이 결과를 내는 순간 작업을 끝내지 않는다.  
그보다:
- [[concepts/execution-safety/validation-repair-and-retry-loops|자동 검증 루프]]를 거치게 하고
- 실패 시 되돌아가게 하고
- [[concepts/tool-design/tool-safety-boundaries|위험 작업을 차단]]하고
- 인간 리뷰가 필요한 지점을 분리한다

즉 CI, guardrails, review boundaries는

> **Claude Code 작업 루프의 종료 조건과 신뢰 경계를 설계하는 계층**

이다.

---

## 흔한 오해

### “테스트만 통과하면 충분하다”
아니다. 리뷰와 정책 검증이 더 필요한 경우가 많다.

### “인간 리뷰는 자동화가 약할 때만 필요하다”
그렇지 않다. 성격상 자동화가 대신할 수 없는 판단도 있다.

### “guardrail은 생산성을 떨어뜨리는 장애물이다”
오히려 큰 실수와 재작업을 줄여 전체 workflow를 더 안정적으로 만든다.

---

## 한 문장 요약

> **CI, guardrails, review boundaries는 Claude Code의 산출물이 자동 검증과 인간 판단을 어떤 신뢰 경계로 통과해야 하는지 정하는 종료 조건 설계다.**
