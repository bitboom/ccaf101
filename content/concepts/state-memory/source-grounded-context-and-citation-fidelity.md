---
title: "Source-grounded Context & Citation Fidelity"
tags:
  - state-memory
  - domain-5
---

# Source-grounded Context & Citation Fidelity

> 이 문서는 CCAF Domain 5를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 요약 그 자체보다, **현재 문맥이 원문과 다시 연결될 수 있는가**를 다룬다. 즉 context를 단순 정보 덩어리가 아니라, **출처와 연결된 검증 가능한 문맥**으로 이해하는 데 초점을 둔다.

## 왜 source-grounding이 중요한가

문맥 안에 정보가 들어 있다고 해서,
그 정보가 곧바로 신뢰 가능한 것은 아니다.

특히 [[concepts/execution-safety/reliability-patterns-for-long-running-agents|장기 실행]]이나 다단계 [[concepts/state-memory/compression-without-losing-meaning|요약]] 과정에서는:
- 원문에서 가져온 사실인지
- 누군가가 요약한 해석인지
- 언제 확인한 정보인지
- 어느 문서/로그/도구 결과에서 왔는지

가 흐려지기 쉽다.

이게 위험한 이유는,
정보 자체보다 **그 정보의 근거를 잃는 순간 검증 가능성도 함께 잃기 때문**이다.

즉 신뢰 가능한 context는 단순한 내용이 아니라,

> **출처와 연결된 내용**

이어야 한다.

---

## source-grounded context란 무엇인가

source-grounded context는
문맥 안의 정보가 단순 주장으로 떠다니는 것이 아니라,
**어떤 원문, 어떤 도구 결과, 어떤 기록에서 왔는지 연결된 상태**를 뜻한다.

예를 들면:
- 문서 요약과 함께 원문 링크가 있음
- 발췌문과 line number가 같이 있음
- 로그 해석과 함께 원본 로그 시점이 붙어 있음
- 도구 결과와 조회 시각이 보존되어 있음

즉 source-grounding의 핵심은:

> **정보를 기억하는 것만이 아니라, 그 정보의 근거를 다시 찾아갈 수 있게 하는 것**

이다.

---

## citation fidelity란 무엇인가

citation fidelity는
요약이나 인용이 원래 출처와 얼마나 충실하게 연결되어 있는지를 뜻한다.

즉 핵심은:
- 정확한 source를 가리키는가
- 원문 의미를 과장하거나 왜곡하지 않는가
- 발췌 범위와 해석이 섞이지 않는가
- 다시 확인 가능한 형태로 남아 있는가

예를 들어:
- “문서에 이런 말이 있었다”보다
- “이 문서의 이 섹션/이 줄에서 이런 내용이 확인된다”

가 citation fidelity가 더 높다.

즉 citation fidelity는 단순 형식 문제가 아니라,

> **문맥의 검증 가능성과 신뢰도를 유지하는 방식**

이다.

---

## 왜 source mapping이 중요한가

장기 실행에서는 문맥이 여러 층을 거친다.

- 원문 문서
- 중간 요약
- 의사결정 메모
- [[concepts/execution-safety/escalation-and-handoff-boundaries|handoff]] summary
- 최종 응답

이렇게 되면 나중에는 “이 결론이 어디서 왔지?”가 매우 중요해진다.

source mapping이 있으면:
- 결론을 다시 원문까지 추적할 수 있고
- 충돌 시 어느 source를 다시 확인해야 하는지 알 수 있고
- 오래된 요약을 새 원문으로 갱신할 수 있다

즉 source mapping은 단순 정리 습관이 아니라,

> **문맥 드리프트를 막는 추적 장치**

다.

---

## 왜 이게 reliability 문제인가

근거 없는 문맥은 처음에는 편해 보인다.  
하지만 시간이 지나면:

- 잘못 요약된 내용이 사실처럼 굳고
- [[concepts/state-memory/context-lifecycle-management|stale]]한 정보가 계속 재사용되고
- 모순이 생겨도 검증 위치를 찾기 어렵고
- 에이전트가 자신감 있게 틀릴 수 있다

즉 source-grounding이 약하면,
문맥은 풍부해 보여도 사실상 **검증 불가능한 기억**이 된다.

그래서 이 문제는 정리 습관이 아니라,

> **장기 실행에서의 grounding reliability 문제**

다.

---

## 흔한 오해

### “요약이 잘 되어 있으면 출처는 굳이 안 남겨도 된다”
아니다. 출처가 없으면 검증 가능성이 크게 떨어진다.

### “citation은 사람용 장식이다”
그렇지 않다. 장기 실행에서는 신뢰성 유지 장치다.

### “원문을 다 들고 있으면 grounded다”
반드시 그렇진 않다. 중요한 것은 원문 존재 자체보다, 현재 문맥과 source의 연결이 유지되는가다.

---

## 한 문장 요약

> **신뢰 가능한 context는 정보를 담는 것만이 아니라, 그 정보가 어디서 왔는지 다시 추적하고 검증할 수 있게 만드는 것이다.**
