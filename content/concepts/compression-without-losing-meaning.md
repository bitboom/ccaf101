---
title: "Compression Without Losing Meaning"
tags:
  - state-memory
  - domain-5
---

# Compression Without Losing Meaning

> 이 문서는 CCAF Domain 5를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 [[concepts/context-lifecycle-management|문맥 수명주기]] 일반론보다, **문맥을 줄일 때 어떻게 다음 판단에 필요한 의미를 보존할 것인가**를 다룬다. 즉 compression을 단순 요약이 아니라, **semantic preservation 문제**로 이해하는 데 초점을 둔다.

## 왜 compression이 필요한가

[[concepts/reliability-patterns-for-long-running-agents|장기 실행]]이나 긴 대화, 큰 조사 작업에서는 문맥이 빠르게 비대해진다. 모든 것을 원문 그대로 유지하면 attention budget이 낭비되고, 중요한 정보가 묻히고, 현재 판단에 불필요한 세부사항이 계속 남는다.

즉 compression의 목적은 단순히 짧게 만드는 것이 아니라,

> **계속 들고 가야 할 의미만 남기고 문맥 부피를 줄이는 것**

이다.

---

## 왜 단순 요약과 compression은 다른가

많은 사람이 compression을 그냥 “짧게 요약하기”로 생각한다.  
하지만 좋은 compression은 단순한 요약보다 더 어렵다.

왜냐면 진짜 중요한 것은
짧아졌느냐가 아니라:

- 다음 작업에 필요한 정보가 남았는가
- 결정의 근거가 살아 있는가
- 불확실한 부분이 지워지지 않았는가
- 이후 행동에 필요한 제약이 유지되는가

이기 때문이다.

즉 compression은:

> **문장의 길이를 줄이는 작업이 아니라, 의미 손실을 관리하는 작업**

에 가깝다.

---

## 왜 summary가 새로운 왜곡원이 될 수 있는가

summary는 원본보다 짧고 편리하지만,
그 과정에서:
- 일부 nuance가 사라지고
- 중요도 판단이 요약자에게 의존하고
- 원래의 불확실성이 단정처럼 바뀌고
- 예외 조건이 빠질 수 있다

즉 요약은 중립적 축약이 아니라 이미 한 번 해석된 결과일 수 있다. 이는 [[concepts/source-grounded-context-and-citation-fidelity|citation fidelity]]가 중요한 이유이기도 하다.

> summary는 유용하지만 동시에 **새로운 왜곡원**이 될 수도 있다.

---

## compression에서 무엇을 남겨야 하는가

좋은 compression은 보통 아래를 우선 보존한다.

- 현재 작업 목표
- 이미 내려진 핵심 결정
- 아직 해결되지 않은 open question
- 이후 단계에 필요한 제약 조건
- 최신 상태를 반영하는 사실
- 중요한 불확실성 또는 위험 신호

반대로 대개 줄이거나 버려도 되는 것은:
- 중복된 논의
- 이미 대체된 세부 정보
- 현재 판단과 무관한 장황한 중간 출력
- 설명적이지만 실행에 영향 없는 배경 서술

즉 핵심은:

> **무엇이 흥미로운가가 아니라, 무엇이 다음 판단에 필요하냐**

다.

---

## compact와 semantic preservation은 왜 tradeoff가 되는가

더 짧게 만들수록 효율은 좋아질 수 있다.  
하지만 그만큼:
- nuance 손실
- 예외 조건 탈락
- 근거 약화
- 단정적 서술 증가

같은 문제가 생길 수 있다.

반대로 너무 보존하려 하면:
- 부피가 거의 줄지 않고
- compression의 이점이 줄어들며
- attention burden이 계속 남는다

즉 compression의 핵심은:

> **최대한 짧게가 아니라, 필요한 의미를 잃지 않을 만큼만 줄이는 것**

이다.

---

## 왜 이게 reliability 문제인가

압축이 잘못되면 문맥이 짧아진 대신,
에이전트는 왜곡된 기준을 들고 다음 단계로 간다.

그 결과:
- 잘못된 전제를 계속 사용하거나
- 원래의 불확실성을 잊어버리거나
- 중요한 예외를 놓치거나
- 이미 요약된 결론만 믿고 원문 검증을 생략할 수 있다

즉 compression 실패는 token 문제를 넘어서,

> **다음 추론의 질을 떨어뜨리는 semantic reliability 문제**

다.

---

## 흔한 오해

### “짧을수록 좋은 압축이다”
아니다. 의미 손실이 크면 더 나쁜 압축일 수 있다.

### “summary는 원문의 축약판일 뿐이다”
그렇지 않다. summary는 이미 해석된 결과일 수 있다.

### “압축은 token 절약 문제다”
그 이상이다. 다음 판단의 의미 신뢰성을 유지하는 문제다.

---

## 한 문장 요약

> **Compression의 목적은 문맥을 짧게 만드는 것이 아니라, 다음 판단에 필요한 의미를 최대한 보존하면서 부피를 줄이는 것이다.**
