---
title: "Schema Design for Reliability"
tags:
  - output-design
  - domain-4
---

# Schema Design for Reliability

> 이 문서는 CCAF Domain 4를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 schema를 단순 validation 규칙이 아니라, **모델 출력을 더 일관되고 검증 가능하게 만드는 신뢰성 구조**로 이해하는 데 초점을 둔다.

## 왜 schema가 중요한가

[[concepts/output-design/structured-output-as-contract|output contract]]를 실제로 작동하게 만들려면, 그 계약을 표현할 구조가 필요하다. 그 역할을 하는 것이 schema다.

schema가 없으면 시스템은:
- 무엇이 필수인지
- 어떤 값이 허용되는지
- 어떤 타입을 기대해야 하는지
- 누락과 오류를 어떻게 판단할지

를 일관되게 정의하기 어렵다.

즉 schema는 단순한 기술적 부속물이 아니라,

> **출력 계약을 실행 가능한 형태로 만드는 구조**

다.

---

## schema는 validation만 위한 것일까

많은 사람이 schema를 “나중에 검사하는 규칙” 정도로 생각한다.  
하지만 실제로는 그보다 더 중요하다.

좋은 schema는:
- 출력을 검증하고
- 잘못된 응답을 걸러내고
- 모델이 어떤 구조를 따라야 하는지 미리 유도한다

즉 schema는 사후 검사 장치이면서 동시에,

> **모델 출력의 형태를 미리 잡아주는 유도 장치**

이기도 하다.

---

## required와 optional은 어떻게 생각해야 하는가

이건 schema design에서 가장 중요한 판단 중 하나다.

### required field
반드시 있어야 하는 필드다.  
이 필드가 빠지면 downstream logic가 제대로 작동하지 않거나,
출력 의미가 크게 흔들린다.

### optional field
있으면 유용하지만,
없어도 기본 동작이나 해석이 무너지지 않는 필드다.

핵심은 단순히 필드를 많이 요구하는 것이 아니라,

> **시스템이 정말로 없으면 안 되는 정보만 required로 두는 것**

이다.

required가 너무 많으면:
- 모델 실패율이 올라가고
- 사소한 누락에도 전체 응답이 무효화될 수 있다

반대로 optional이 너무 많으면:
- 출력의 예측 가능성이 약해지고
- downstream logic가 복잡해진다

즉 schema design은 엄격함과 유연성 사이 균형 문제다.

---

## 좋은 필드 설계는 어떤 특징을 가지는가

좋은 schema field는 보통 다음 특징을 가진다.

- 이름이 의미를 분명히 드러낸다
- 타입이 예측 가능하다
- 값의 범위가 지나치게 넓지 않다
- 서로 다른 의미가 한 필드에 섞이지 않는다
- downstream consumer가 그대로 쓰기 쉽다

예를 들어:
- `status`가 있다면 허용 가능한 값 범위를 좁게 잡는 편이 낫고
- `score`가 있다면 숫자 범위와 의미를 분명히 해야 하며
- `summary_or_error`처럼 두 의미를 한 필드에 섞는 것은 피하는 편이 좋다

즉 좋은 schema는 항목 나열이 아니라,

> **모델과 시스템이 같은 의미 구조를 공유하게 만드는 설계**

다.

---

## enum, nesting, typing은 왜 중요한가

### enum
값의 선택지를 제한하면 해석 안정성이 올라간다.  
예:
- `low | medium | high`
- `pass | fail | uncertain`

이런 enum은 자유 텍스트보다 후속 처리가 훨씬 쉽다.

### nesting
관련된 정보를 묶어 주면 구조가 더 선명해진다.  
하지만 너무 깊어지면 모델도 consumer도 다루기 어려워질 수 있다.

### typing
문자열, 숫자, boolean, 배열, 객체 구분은 단순 기술 문제가 아니다.  
타입이 불분명하면 downstream logic도 불안정해진다.

즉 schema reliability는 세부 필드 설계에서 나온다.

---

## schema가 너무 느슨하거나 너무 빡빡하면 왜 문제인가

### 너무 느슨한 schema
- 필드 의미가 흔들림
- 값 범위가 너무 넓음
- validation이 약함
- 모델 출력이 들쭉날쭉함

### 너무 빡빡한 schema
- 사소한 변형도 실패 처리됨
- 복구 비용이 커짐
- 모델이 응답을 자주 못 맞춤
- 실전 입력 다양성을 감당하기 어려움

좋은 schema는 양 극단을 피해야 한다.

즉 핵심은:

> **무엇을 엄격하게 고정하고, 무엇을 유연하게 허용할지 전략적으로 정하는 것**

이다.

---

## 왜 schema design이 reliability와 직결되는가

schema가 안정적이면:
- [[concepts/execution-safety/validation-repair-and-retry-loops|validation]]이 명확해지고
- repair logic도 단순해지고
- [[concepts/output-design/batch-generation-strategy|batch processing]]도 쉬워지고
- downstream consumer가 예측 가능하게 동작한다

반대로 schema가 애매하면,
출력 품질 문제가 곧 시스템 불안정으로 이어진다.

즉 schema design은 출력 형식을 예쁘게 만드는 일이 아니라,

> **출력 신뢰성을 구조적으로 확보하는 일**

이다.

---

## 흔한 오해

### “schema는 validation 단계에서만 중요하다”
아니다. schema는 모델 출력 자체도 유도한다.

### “필드는 많을수록 정보가 풍부하다”
그렇지 않다. 불필요한 필드는 실패 가능성과 복잡성만 키울 수 있다.

### “엄격한 schema일수록 무조건 좋다”
아니다. 지나친 엄격함은 실전 robustness를 해칠 수 있다.

---

## 한 문장 요약

> **좋은 schema는 출력을 검증하는 규칙이면서 동시에, 모델이 더 일관되고 신뢰 가능한 출력을 내도록 유도하는 구조다.**
