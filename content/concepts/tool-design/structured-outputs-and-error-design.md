---
title: "Structured Outputs & Error Design"
tags:
  - tool-interface
  - domain-2
---

# Structured Outputs & Error Design

> 이 문서는 CCAF Domain 2를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 tool output을 단순한 반환값이 아니라, **에이전트가 다음 행동을 더 정확하게 결정하도록 돕는 구조화된 신호**로 이해하는 데 초점을 둔다.

## 왜 output design이 중요한가

[[concepts/tool-design/tool-interface-design|Tool interface design]]에서 많은 사람이 입력 인터페이스에만 집중한다.  
하지만 실제 에이전트 품질은 **출력을 어떻게 돌려주느냐**에도 크게 좌우된다.

도구 결과가 애매하면 모델은:
- 값을 잘못 해석하거나
- 실패를 성공처럼 오해하거나
- 재시도해야 할 상황을 종료해버리거나
- 부분 성공과 완전 실패를 구분하지 못할 수 있다

즉 tool output은 단순히 “결과 전달”이 아니라,

> **다음 판단의 재료를 만드는 단계**

다.

---

## 왜 자유 텍스트만으로는 부족한가

자유 텍스트는 사람이 읽기에는 자연스럽다.  
하지만 에이전트 시스템에서는 종종 너무 모호하다.

예를 들어 이런 반환을 생각해보자.

> “고객 정보를 찾을 수 없었습니다. 나중에 다시 시도해 보세요.”

이 문장만으로는 아래를 구분하기 어렵다.

- 고객이 실제로 없는 것인가
- DB가 잠시 응답하지 않은 것인가
- 권한이 없는 것인가
- 입력 형식이 잘못된 것인가

즉 텍스트 하나에 너무 많은 의미가 섞이면,
모델은 다음 행동을 안정적으로 고르기 어렵다.

그래서 좋은 도구 출력은 보통:
- 상태
- 핵심 값
- 메타데이터
- 에러 정보

를 더 구조화해서 돌려준다.

---

## structured output은 무엇을 가능하게 하는가

Structured output의 장점은 단순히 파싱이 쉽다는 데 있지 않다.  
더 중요한 건 **다음 행동 선택이 더 안정적**이 된다는 점이다.

예를 들어 아래처럼 반환하면:

```json
{
  "status": "error",
  "errorCategory": "transient",
  "isRetryable": true,
  "message": "database timeout"
}
```

모델은:
- 이건 영구 실패가 아니라 일시적 실패라는 점
- 재시도가 가능하다는 점
- 종료보다 복구 행동이 적절하다는 점

을 더 안정적으로 판단할 수 있다.

즉 structured output은:

> **모델이 결과를 해석하는 부담을 줄이고, 더 안전한 후속 행동을 고르게 만드는 방식**

이다.

---

## 어떤 필드를 구조화해야 하는가

도구마다 다르지만, 보통 아래 네 축이 중요하다.

### 1. status
성공인지 실패인지, 혹은 부분 성공인지 드러내는 필드다.

예:
- `success`
- `error`
- `partial`

### 2. result
실제로 필요한 핵심 값이다.

예:
- 조회된 고객 정보
- 검색 결과 목록
- 계산 결과
- 파일 수정 결과

### 3. metadata
결과 자체는 아니지만, 해석에 중요한 부가 정보다.

예:
- timestamp
- query used
- matched count
- partial coverage 여부

### 4. error
실패 시 후속 행동을 결정하는 데 필요한 구조화된 정보다.

예:
- error category
- retryability
- escalation 필요 여부
- validation 실패 사유

즉 좋은 output은 결과를 뿌리는 것이 아니라,
**판단에 필요한 층위를 분리해서 반환하는 것**에 가깝다. 이런 구조 설계는 [[concepts/output-design/schema-design-for-reliability|Schema Design for Reliability]]와도 밀접하게 연결된다.

---

## Error design은 왜 별도로 중요할까

실전 시스템에서 도구는 자주 실패한다.  
중요한 것은 실패를 없애는 것이 아니라, **실패를 어떻게 표현하느냐**다.

나쁜 error design의 예:
- 모든 실패를 `"something went wrong"`로 반환
- 예외 메시지를 그대로 던짐
- retry 가능 여부를 구분하지 않음
- validation error와 permission error를 섞음

이러면 모델은:
- 다시 시도해야 할지
- 다른 도구를 써야 할지
- 사용자에게 추가 입력을 받아야 할지
- 사람에게 넘겨야 할지

판단하기 어려워진다.

즉 error는 단순한 실패 로그가 아니라,

> **복구 전략을 고르게 만드는 제어 신호**

여야 한다.

---

## 에러는 어떻게 분류하는 편이 좋은가

시험과 실무 모두에서 자주 쓰는 구분은 이 정도다.

### validation error
입력 자체가 잘못된 경우  
예:
- 잘못된 ID 형식
- 필수 파라미터 누락
- 날짜 형식 오류

이 경우 보통 재시도보다 **입력 수정**이 필요하다.

### transient error
일시적 장애  
예:
- timeout
- rate limit
- 일시적 네트워크 오류

이 경우는 **재시도**가 합리적일 수 있다.

### permission error
권한 부족 또는 접근 불가  
예:
- 인증 실패
- 권한 없는 리소스 접근
- 제한된 작업 요청

이 경우는 단순 재시도보다 **권한 상승, 다른 경로, 사람 개입**이 필요할 수 있다.

### business / policy error
비즈니스 규칙 또는 정책 위반  
예:
- 환불 한도 초과
- 승인 없는 상태 변경 요청
- 정책상 금지된 작업

이 경우는 재시도보다 **설명, 우회 경로, [[concepts/execution-safety/escalation-and-handoff-boundaries|에스컬레이션]]**이 더 적절할 수 있다.

즉 에러 카테고리는 개발자 편의가 아니라,
**에이전트의 다음 행동 선택 품질**을 위한 설계다. 이 구분은 [[concepts/execution-safety/validation-repair-and-retry-loops|Validation, Repair & Retry Loops]]에서 재시도 전략을 정할 때 직접적으로 활용된다.

---

## retryable / non-retryable 구분은 왜 중요한가

모든 실패를 재시도하면 시스템이 시끄럽고 비효율적이 된다.  
반대로 재시도 가능한 실패를 바로 종료해도 품질이 떨어진다.

그래서 `isRetryable` 같은 신호는 중요하다.

예:
- timeout → retryable
- malformed input → non-retryable
- permission denied → 대체로 non-retryable
- temporary upstream overload → retryable

이 구분이 있으면 모델은:
- 다시 시도할지
- 사용자에게 정정 요청할지
- 다른 도구로 우회할지
- [[concepts/execution-safety/escalation-and-handoff-boundaries|에스컬레이션]]할지

를 더 잘 고를 수 있다.

---

## 부분 성공과 완전 실패를 구분해야 한다

에이전트 시스템에서 중요한 것은 성공/실패 이분법만이 아니다.  
일부 결과를 얻었지만 전체는 완성되지 않은 경우도 많다.

예:
- 10개 문서 중 7개만 읽음
- 검색은 성공했지만 일부 소스가 timeout
- 고객 기본 정보는 조회했지만 주문 이력은 실패

이런 경우를 단순 실패로 뭉개면 쓸 수 있는 정보도 함께 버리게 된다.

따라서 tool output은 가능하면:
- 완전 성공
- 부분 성공
- 완전 실패

를 구분하는 편이 좋다.

즉 좋은 output design은 결과를 예쁘게 포장하는 것이 아니라,

> **무엇이 확보되었고 무엇이 아직 불확실한지를 분리해서 드러내는 방식**

이다.

---

## 흔한 오해

### “사람이 읽을 수 있으면 좋은 출력이다”
아니다. 에이전트 시스템에서는 후속 판단에 필요한 구조가 더 중요하다.

### “에러 메시지만 자세하면 충분하다”
그렇지 않다. category와 retryability 같은 구조적 신호가 필요하다.

### “structured output은 파싱 편의성 문제다”
그 이상이다. 이건 다음 행동 선택의 신뢰성 문제다.

---

## 한 문장 요약

> **Structured outputs와 error design은 결과를 보기 좋게 만드는 작업이 아니라, 에이전트가 다음 행동을 더 정확하고 안전하게 선택하도록 만드는 설계다.**
