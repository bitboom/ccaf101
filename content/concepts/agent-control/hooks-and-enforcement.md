---
title: "Hooks & Enforcement"
tags:
  - agent-control
  - domain-1
---

# Hooks & Enforcement

> 이 문서는 CCAF Domain 1을 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 hooks와 enforcement를 단순한 구현 디테일이 아니라, **에이전트 시스템이 중요한 규칙을 확실하게 지키게 만드는 통제 계층**으로 이해하는 데 초점을 둔다.

## Hooks란 무엇인가

Hook은 [[concepts/agent-control/agent-loop|Agent Loop]]의 특정 지점에 **프로그램적으로 개입하는 장치**다.  
즉 모델이 자유롭게 판단하도록 두는 대신, 시스템이 특정 단계에서 개입해:

- 결과를 정리하거나
- 호출을 막거나
- 조건을 검사하거나
- 형식을 강제할 수 있게 한다

즉 hook은 단순한 보조 기능이 아니라,

> **모델의 확률적 행동 위에 결정적 통제를 얹는 계층**

이라고 볼 수 있다.

---

## 왜 Hooks가 필요한가

프롬프트만으로는 중요한 규칙을 100% 보장할 수 없다.  
모델은 지침을 따를 수는 있지만, 항상 완벽하게 따르지는 않는다.

예를 들어:

- 환불 전에 고객 ID 검증이 반드시 필요하거나
- 일정 금액 이상의 환불은 사람 승인으로 넘겨야 하거나
- 특정 위험 도구 호출을 차단해야 하거나
- 도구 결과를 일관된 형식으로 정규화해야 하는 경우

이런 요구사항은 “가능하면 지켜줘”가 아니라,
**반드시 지켜야 하는 규칙**이다.

이때 hook이 필요하다.

> **중요한 규칙일수록 프롬프트가 아니라 시스템으로 강제해야 한다.**

---

## Prompt guidance와 Programmatic enforcement는 어떻게 다른가

이 구분은 Domain 1의 핵심이다.

### Prompt guidance
- “이렇게 해줘”
- 선호
- 스타일
- soft rule
- 확률적으로 따름

### Programmatic enforcement
- hook
- gate
- interception
- hard rule
- 결정적으로 강제됨

즉:

- **Preference** → prompt
- **Policy / compliance / financial risk** → programmatic enforcement

예를 들어:

- “친절하게 답해라” → prompt
- “검증된 고객 ID 없이는 환불 금지” → hook/gate

핵심은 단순하다.  
**선호는 유도하고, 위험은 강제한다.**

---

## Hook은 어디에 개입하는가

Hook은 agent loop의 여러 경계 지점에 들어갈 수 있다.

- tool 실행 전 ([[concepts/tool-design/tool-safety-boundaries|Tool Safety Boundaries]] 참고)
- tool 실행 후
- 응답 생성 전
- handoff 직전 ([[concepts/execution-safety/escalation-and-handoff-boundaries|Escalation & Handoff Boundaries]] 참고)

즉 hook은 모델의 추론 자체를 대체하기보다,

> **루프의 경계에서 시스템 규칙을 적용하는 방식**

에 가깝다.

---

## 대표적인 Hook / Enforcement 패턴

### 1. PostToolUse Hook

도구 실행 결과를 모델이 보기 전에 **정리하거나 표준화**하는 방식이다.

예를 들면:

- Unix timestamp를 읽기 쉬운 형식으로 변환
- 상태 코드를 일관된 문자열로 변환
- 필드명을 정규화
- 너무 많은 결과 중 필요한 필드만 남김

이런 정규화는 사소해 보여도 중요하다.  
모델이 다음 판단을 할 때 보는 입력 품질을 높여주기 때문이다.

즉 PostToolUse hook은:

> **모델이 더 안정적으로 해석할 수 있는 입력을 만드는 정제 계층**

이다.

---

### 2. Tool interception

Tool interception은 **도구 호출 자체를 가로채는 것**이다.

예를 들면:

- 환불 금액이 $500 초과면 차단
- 특정 위험 명령은 금지
- 특정 조건을 만족하지 않으면 사람 승인을 요구
- 허용되지 않은 도구 사용은 reject

이건 모델에게 “하지 마”라고 말하는 게 아니라,
**시스템이 실제 호출을 막는 것**이다.

즉 interception은:

> **실수를 줄이는 것이 아니라, 실행 자체를 막는 방식**

이다.

---

### 3. Prerequisite gate

Prerequisite gate는 어떤 행동 전에 **필수 조건이 충족됐는지 검사하는 구조**다.

예를 들어:

- `process_refund` 전에 검증된 customer ID가 있어야 함
- 데이터 삭제 전에 권한 검증이 끝나야 함
- 배포 전에 테스트 성공 상태가 있어야 함

이건 단순 체크리스트가 아니다.  
실제로는:

> **조건이 충족되지 않으면 다음 단계로 못 넘어가게 막는 제어 장치**

다.

그래서 prerequisite gate는 business rule enforcement에 매우 적합하다.

---

## 왜 Hooks는 “설명”보다 “보장”에 가까운가

Prompt는 설명이다.  
Hook은 보장이다.

감각적으로 줄이면 이렇다.

- prompt: “이렇게 행동해줘”
- hook: “이 조건 안 되면 못 지나감”

즉 hook의 핵심은 모델을 더 예쁘게 유도하는 것이 아니라,
**실제 시스템 행동을 신뢰 가능한 방식으로 제한하는 것**이다.

---

## 실무적으로 무엇을 hook으로 빼야 하는가

모든 규칙을 hook으로 만들 필요는 없다.  
하지만 아래에 가까울수록 prompt보다 enforcement가 낫다.

- 금전 손실 위험이 있는 규칙
- 보안/권한 관련 규칙
- 정책 위반 위험이 큰 규칙
- 반드시 특정 순서를 지켜야 하는 절차
- 출력 형식 불일치가 연쇄 오류를 만드는 경우

반대로 아래는 prompt로도 충분한 경우가 많다.

- 말투
- 친절함
- 설명 스타일
- 예시의 풍부함
- 응답 길이 선호

요점은 이거다.

> **선호는 prompt로, 위험은 enforcement로 다뤄라.**

---

## 런타임 관점에서 보면

OpenClaw 같은 런타임에서 hooks는 부가 기능이 아니라,
**에이전트 루프를 안전하게 운영하는 핵심 메커니즘**에 가깝다.

런타임은 단순히 모델을 호출하는 것이 아니라,

- 어떤 도구를 허용할지 결정하고
- 어떤 결과를 정제할지 정하고
- 어떤 조건에서 실행을 차단할지 정하고
- 언제 사람 승인으로 넘길지 정한다

이 관점에서 hooks는 장식이 아니라,
**운영 품질과 안전성을 지탱하는 제어면(control plane)** 이다.

---

## 흔한 오해

### “프롬프트를 잘 쓰면 enforcement는 필요 없다”
아니다. 프롬프트는 강한 힌트일 수는 있어도, 확실한 보장은 아니다.

### “Hook이 많을수록 더 똑똑한 시스템이다”
그것도 아니다. Hook이 너무 많으면 시스템이 과하게 경직될 수 있다.  
중요한 것은 수가 아니라 **어디에 결정적 통제가 필요한지**를 잘 고르는 것이다.

### “모든 business rule을 모델에게 이해시키면 된다”
실무에서는 그보다 **모델이 규칙을 어길 수 없는 구조**를 먼저 설계하는 편이 더 안전하다.

---

## 한 문장 요약

> **Hooks와 enforcement는 모델을 더 설득하는 장치가 아니라, 중요한 규칙을 시스템 차원에서 확실히 지키게 만드는 통제 계층이다.**

---

## 관련 개념

- [[concepts/agent-control/agent-loop|Agent Loop]] — hook이 개입하는 실행 루프
- [[concepts/tool-design/tool-safety-boundaries|Tool Safety Boundaries]] — 도구 호출에 대한 안전 경계 설계
- [[concepts/execution-safety/ci-guardrails-and-review-boundaries|CI Guardrails & Review Boundaries]] — CI 파이프라인에서의 enforcement 패턴
- [[concepts/execution-safety/claude-md-and-instruction-hierarchy|CLAUDE.md & Instruction Hierarchy]] — prompt guidance와 enforcement의 경계

## 더 읽어보기

- Claude / tool use 관련 공식 문서
- runtime orchestration / guardrails / policy enforcement 관련 자료
