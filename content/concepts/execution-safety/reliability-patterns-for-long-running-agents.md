---
title: "Reliability Patterns for Long-running Agents"
tags:
  - execution-safety
  - domain-5
---

# Reliability Patterns for Long-running Agents

> 이 문서는 CCAF Domain 5를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 외부 상태 자체보다, **장기 실행 중 드리프트를 감지하고 최신 기준점에 다시 접속하는 운영 패턴**을 다룬다. 즉 long-running reliability를 단순 지속 실행이 아니라, **re-grounding pattern**으로 이해하는 데 초점을 둔다.

## 왜 long-running agent는 흔들리는가

짧은 작업에서는 드러나지 않던 문제가,
작업 시간이 길어질수록 커진다.

예를 들면:
- 목표를 조금씩 잊어버림
- 예전 결정을 최신 사실처럼 붙잡음
- [[concepts/state-memory/context-lifecycle-management|stale]] tool result를 계속 신뢰함
- 이미 해결한 문제를 다시 논의함
- 중간에 생긴 예외 조건을 놓침

즉 장기 실행의 문제는 단순 피로가 아니라,

> **문맥 드리프트와 기준점 상실**

에 가깝다.

---

## drift란 무엇인가

drift는 에이전트가 처음의 목표와 기준에서
조금씩 멀어지는 현상을 뜻한다.

예:
- 원래 목표는 “버그 수정”인데 점점 리팩터링으로 퍼짐
- 처음엔 최신 로그를 봤는데 이후엔 예전 로그 기준으로 판단함
- 사용자 요구가 바뀌었는데 예전 요구를 계속 전제로 삼음
- 현재 단계에서 중요하지 않은 세부 탐색이 중심이 됨

즉 drift는 갑자기 큰 실수가 나는 게 아니라,

> **작은 어긋남이 누적돼 전체 방향이 흐려지는 현상**

이다.

---

## stale tool result는 왜 위험한가

장기 실행에서는 tool result가 빠르게 낡는다.

예:
- 예전 `git status`
- 몇 시간 전 테스트 결과
- 이전 파일 내용
- 오래된 CI 상태
- 한참 전 조회한 외부 데이터

이런 결과는 당시엔 맞았어도,
지금의 판단 근거로는 부적절할 수 있다.

문제는 stale result가
종종 **매우 구체적이어서 오히려 더 신뢰해 보인다**는 점이다.

즉 long-running reliability에서 중요한 것은:

> **도구 결과를 많이 모으는 것이 아니라, 언제 다시 확인해야 하는지를 아는 것**

이다.

---

## validation checkpoint는 왜 필요한가

장기 작업일수록 중간중간 기준점을 다시 확인해야 한다.

예:
- 아직 목표가 같은가
- 최신 상태를 다시 조회해야 하는가
- 이전 요약이 아직 유효한가
- 남은 TODO가 바뀌지 않았는가
- 지금 하려는 단계가 원래 계획과 맞는가

이런 checkpoint가 없으면,
에이전트는 한 번 잡은 전제를 계속 들고 가다 드리프트한다.

즉 validation checkpoint는 단순 점검이 아니라,

> **긴 작업에서 방향을 재정렬하는 재접지(re-grounding) 지점**

이다.

---

## re-grounding은 무엇을 뜻하는가

re-grounding은 에이전트가 다시
최신 사실, 최신 목표, 최신 제약에 연결되는 것을 뜻한다.

예:
- 파일을 다시 읽음
- 최신 테스트를 다시 실행함
- 현재 요구사항을 다시 확인함
- [[concepts/state-memory/scratchpads-working-memory-and-external-state|scratchpad / manifest]]를 기준으로 상태를 재동기화함
- 요약 대신 [[concepts/state-memory/source-grounded-context-and-citation-fidelity|원문 source]]를 다시 확인함

즉 re-grounding은 “처음부터 다시”가 아니라,

> **현재 시점의 기준점에 다시 접속하는 것**

이다.

이게 있어야 장기 실행에서도
문맥이 현실과 다시 맞물린다.

---

## long-running reliability는 어떤 패턴에서 나오는가

보통 신뢰성 있는 장기 실행은 아래 패턴을 가진다.

- 주기적으로 목표를 재확인한다
- stale 가능성이 큰 정보는 다시 조회한다
- 중간 결과를 [[concepts/state-memory/scratchpads-working-memory-and-external-state|external state]]에 남긴다
- checkpoint마다 방향을 다시 맞춘다
- 불확실성이 커지면 [[concepts/execution-safety/escalation-and-handoff-boundaries|handoff]]를 고려한다
- summary만 믿지 않고 [[concepts/state-memory/source-grounded-context-and-citation-fidelity|source]]로 돌아갈 수 있다

즉 long-running reliability의 핵심은
한 번 똑똑하게 시작하는 것이 아니라,

> **계속해서 기준점에 다시 접속하는 운영 습관**

이다.

---

## 왜 이게 D5의 마지막 문서로 좋나

D5의 앞 문서들이:
- [[concepts/state-memory/context-lifecycle-management|lifecycle]]
- [[concepts/state-memory/compression-without-losing-meaning|compression]]
- [[concepts/state-memory/source-grounded-context-and-citation-fidelity|source fidelity]]
- [[concepts/execution-safety/escalation-and-handoff-boundaries|handoff]]
- [[concepts/state-memory/scratchpads-working-memory-and-external-state|external state]]

를 각각 다뤘다면,
이 문서는 그것들을 하나의 장기 실행 패턴으로 다시 묶는다.

즉 long-running agent reliability는
개별 팁이 아니라,

> **문맥 수명주기, 의미 보존, grounding, handoff, 외부 상태를 함께 굴리는 re-grounding pattern의 결과**

로 보는 것이 맞다.

---

## 흔한 오해

### “오래 실행 가능한 에이전트는 그냥 문맥 창이 큰 에이전트다”
아니다. 중요한 것은 크기보다 드리프트 제어다.

### “한 번 최신 상태를 확인했으면 충분하다”
그렇지 않다. 장기 작업에서는 다시 stale해질 수 있다.

### “더 많이 기억하면 reliability도 올라간다”
아니다. 정리되지 않은 기억은 오히려 드리프트를 키울 수 있다.

---

## 한 문장 요약

> **장기 실행 에이전트의 신뢰성은 오래 버티는 능력보다, 드리프트를 감지하고 최신 기준점에 다시 접속하는 re-grounding pattern에 달려 있다.**
