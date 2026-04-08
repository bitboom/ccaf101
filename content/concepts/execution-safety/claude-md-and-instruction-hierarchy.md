---
title: "CLAUDE.md & Instruction Hierarchy"
tags:
  - workflow
  - domain-3
---

# CLAUDE.md & Instruction Hierarchy

> 이 문서는 CCAF Domain 3를 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 규칙의 “내용”보다, **규칙이 어디서 오고 어떤 범위와 우선순위로 적용되는가**를 다룬다. 즉 `CLAUDE.md`와 instruction hierarchy를 단순 설정 파일 체계가 아니라, **Claude Code가 어떤 규칙 구조 안에서 행동하는지를 정하는 제어 표면(control surface)** 으로 이해하는 데 초점을 둔다.

## 왜 instruction hierarchy가 중요한가

Claude Code의 행동은 모델 능력만으로 결정되지 않는다.  
실제로는 어떤 규칙이 어떤 범위에서 적용되는지에 크게 좌우된다.

예를 들어 같은 모델이라도:
- 전역 규칙이 다르거나
- 프로젝트 루트의 `CLAUDE.md`가 다르거나
- 특정 하위 디렉토리에 추가 규칙이 있으면

코드 수정 방식, 테스트 습관, 금지 행동, 설명 방식까지 달라질 수 있다.

즉 중요한 것은 단순히 “무슨 규칙이 있느냐”가 아니라,

> **어떤 규칙이 어디서 오고, 어떤 우선순위로 작동하느냐**

다.

---

## `CLAUDE.md`는 무엇인가

`CLAUDE.md`는 Claude Code가 특정 저장소에서 작업할 때 참고하는  
**프로젝트 수준의 운영 규칙 파일**로 이해하는 것이 좋다.

이 파일에는 보통:
- 저장소 전반에 적용되는 작업 원칙
- 테스트 / 검증 습관
- 특정 금지사항
- [[concepts/execution-safety/team-conventions-and-reproducibility|팀 규약]]과 절차
- 코드베이스를 다룰 때의 주의점

이 담긴다.

즉 `CLAUDE.md`는 README 보조문서가 아니라,

> **Claude Code가 이 저장소에서 어떤 규칙 구조 안에서 일해야 하는지 알려주는 기준점**

에 가깝다.

---

## instruction hierarchy는 무엇을 뜻하는가

Instruction hierarchy는 여러 규칙이 동시에 존재할 때,  
**어떤 지시를 더 우선해서 적용할지**를 뜻한다.

감각적으로는 아래 질문이다.

- 전역 규칙과 프로젝트 규칙이 함께 있으면 무엇이 더 강한가?
- 루트 규칙과 하위 디렉토리 규칙이 다르면 어떤 것이 더 가까운 맥락인가?
- 일반 원칙과 작업 특화 규칙이 충돌하면 무엇을 우선해야 하는가?

즉 hierarchy의 핵심은 규칙의 존재 그 자체보다,

> **규칙의 적용 범위(scope)와 우선순위(precedence)**

다.

---

## 왜 규칙의 scope가 중요한가

좋은 규칙 구조는 모든 것을 한 파일에 몰아넣지 않는다.  
범위가 다른 규칙은 다른 층위에 두는 편이 낫다.

예를 들면:
- 전역 규칙: 어디서나 유지할 공통 습관
- 프로젝트 규칙: 저장소 전체에 적용할 원칙
- 하위 디렉토리 규칙: 특정 서비스나 모듈에만 적용할 예외 규칙

이렇게 나누면 Claude Code는  
**지금 작업 중인 위치와 더 가까운 규칙**을 참고할 수 있다.

즉 instruction hierarchy의 목적은 규칙을 더 많이 추가하는 것이 아니라,

> **규칙을 더 정확한 범위에 배치하는 것**

이다.

---

## 왜 이게 harness engineering과 닿아 있는가

이걸 단순 설정 파일 문제로 보면 반만 본 것이다.  
실제로는 Claude Code가 어떤 규칙 표면을 먼저 보고 행동할지 설계하는 일이기 때문이다.

즉 `CLAUDE.md`와 hierarchy를 잘 설계한다는 것은:
- 모델이 어떤 지시를 먼저 접하게 할지 정하고
- 규칙 충돌을 줄이고
- 팀 기준을 실행 환경 안에 배치하고
- 행동 편차를 줄이는 것

과 연결된다. 여기서 규칙의 내용 자체를 어떻게 구성할지는 [[concepts/execution-safety/rules-as-operational-memory|Rules as Operational Memory]]에서, 규칙을 런타임에 강제하는 방법은 [[concepts/agent-control/hooks-and-enforcement|Hooks & Enforcement]]에서 다룬다.

그래서 이 문맥에서 `CLAUDE.md`와 instruction hierarchy는,

> **작업 하니스의 규칙 구조를 정하는 제어면(control plane)**

에 가깝다.

---

## 흔한 오해

### “`CLAUDE.md`는 그냥 프로젝트 설명 문서다”
아니다. 핵심은 저장소 설명이 아니라 작업 규칙 구조다.

### “규칙은 한 군데에 몰아넣을수록 관리가 쉽다”
그렇지 않다. 범위가 다른 규칙을 한데 몰면 적용 맥락이 흐려진다.

### “규칙은 많을수록 좋다”
아니다. hierarchy가 흐려지고 중요한 규칙이 묻힌다.

---

## 한 문장 요약

> **`CLAUDE.md`와 instruction hierarchy는 Claude Code가 어떤 규칙 구조 안에서 행동할지를 정하는 제어 표면이다.**
