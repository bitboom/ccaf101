---
title: "Batch Generation Strategy"
tags:
  - output-design
  - domain-4
---

# Batch Generation Strategy

> 이 문서는 CCAF Domain 4를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 batch generation을 단순히 “많이 한 번에 돌리는 방식”이 아니라, **처리량과 출력 품질 사이의 균형을 설계하는 운영 전략**으로 이해하는 데 초점을 둔다.

## 왜 batch generation이 중요한가

출력을 한 건씩 생성할 때와,
많은 항목을 한 번에 처리할 때는 문제가 달라진다.

단건 생성에서는:
- 한 출력의 품질
- 형식 준수
- 수동 확인 가능성

이 중심이 된다.

반면 batch generation에서는 여기에 더해:
- 처리량
- 비용
- 지연 시간
- 실패 항목 처리 ([[concepts/validation-repair-and-retry-loops|validation/repair/retry]])
- 전체 일관성 유지

가 중요한 문제가 된다.

즉 batch generation의 핵심은 단순 속도가 아니라,

> **많은 출력을 안정적으로 생산하는 운영 설계**

다.

---

## 왜 단건 전략을 그대로 쓰면 안 되는가

단건에서는 한 번 실패해도 다시 시도하면 된다.  
하지만 batch에서는 일부 항목만 실패하거나,
항목마다 품질 편차가 생기거나,
검증 비용이 크게 늘어날 수 있다.

예를 들어 100건을 처리할 때:
- 97건은 유효
- 3건은 [[concepts/schema-design-for-reliability|schema]] 실패

라면 전체를 실패로 돌릴지,
3건만 retry할지,
부분 성공으로 처리할지 전략이 필요하다.

즉 batch에서는 출력 하나의 정답성만이 아니라,

> **전체 집합을 어떻게 운영할 것인가**

가 문제다.

---

## batch strategy에서 중요한 질문은 무엇인가

보통 아래 질문이 중요하다.

- 한 번에 몇 개를 묶을 것인가
- 전체 실패와 부분 실패를 어떻게 구분할 것인가
- 어떤 검증을 항목별로 하고 어떤 검증을 배치 단위로 할 것인가
- retry는 전체에 할지 일부에만 할지
- 일관성보다 처리량을 우선할지, 반대로 할지

즉 batch generation은 호출 수만의 문제가 아니라,

> **품질 관리 단위를 어떻게 잡을 것인가**

의 문제다.

---

## throughput과 consistency는 왜 tradeoff가 되는가

많이 묶어 한 번에 처리하면 처리량은 좋아질 수 있다.  
하지만 그만큼 다음 문제가 생길 수 있다.

- 항목별 품질 편차가 커짐
- 일부 실패를 세밀하게 다루기 어려워짐
- [[concepts/validation-repair-and-retry-loops|validation과 repair]]가 복잡해짐
- 출력 패턴이 흔들릴 가능성이 높아짐

반대로 더 잘게 나누면:
- 항목별 제어는 쉬워지지만
- 요청 수가 늘고
- 지연과 비용이 커질 수 있다

즉 batch strategy의 핵심은:

> **처리량을 높이면서도 품질이 무너지지 않게 균형을 잡는 것**

이다.

---

## 부분 실패는 어떻게 다뤄야 하는가

batch에서는 “전체 성공 / 전체 실패” 이분법이 자주 맞지 않는다.

예:
- 일부 항목만 schema 위반
- 일부 항목만 low confidence
- 일부 항목만 필수 필드 누락
- 일부 항목만 retry 후 복구 가능

이럴 때 중요한 것은:
- 어떤 실패는 부분 retry로 해결할 수 있고
- 어떤 실패는 전체 재생성이 필요 없으며
- 어떤 경우는 부분 성공으로 결과를 넘길 수도 있다는 점이다

즉 좋은 batch system은:

> **전체를 한 덩어리로 취급하지 않고, 부분 실패를 관리 가능한 단위로 다룰 수 있어야 한다**

는 특징을 가진다.

---

## batch에서도 validation loop가 필요한가

당연히 필요하다.  
오히려 batch일수록 더 중요하다.

왜냐면 batch는 출력 수가 많아
사람이 하나하나 수동으로 확인하기 어렵기 때문이다.

그래서 batch에서는:
- [[concepts/schema-design-for-reliability|schema]] validation
- field completeness check
- sample-based human review
- failed subset retry
- batch-level quality monitoring

같은 루프가 더 중요해진다.

즉 batch generation은 “많이 찍어내기”가 아니라,

> **대량 상황에 맞는 검증 루프를 붙여 운영하는 방식**

이어야 한다.

---

## 언제 batch가 특히 유리한가

batch는 보통 아래 상황에서 유리하다.

- 많은 항목에 같은 출력 구조를 적용해야 할 때
- 개별 항목이 비교적 독립적일 때
- 전체 처리량이 중요할 때
- 후속 시스템이 일괄 소비하기 쉬울 때

예:
- 대량 분류
- 대량 요약
- 대량 태깅
- 문서 집합 메타데이터 추출

반대로 항목 간 상호의존성이 크거나,
고품질 개별 reasoning이 중요한 경우는
더 작은 단위가 나을 수 있다.

---

## 흔한 오해

### “batch는 무조건 더 효율적이다”
그렇지 않다. 품질 통제가 무너지면 전체 비용이 더 커질 수 있다.

### “일부 실패가 있으면 전체를 다시 돌리면 된다”
아니다. 부분 retry가 더 합리적일 수 있다.

### “단건에서 잘 되던 프롬프트는 batch에서도 그대로 잘 된다”
반드시 그렇지 않다. 대량 처리에 맞는 validation과 failure handling이 필요하다.

---

## 한 문장 요약

> **Batch generation의 핵심은 많이 한 번에 돌리는 것이 아니라, 처리량·일관성·부분 실패 복구 사이의 균형을 운영 전략으로 설계하는 것이다.**
