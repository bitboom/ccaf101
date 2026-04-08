---
title: "Agent Loop"
tags:
  - agent-control
  - domain-1
---

# Agent Loop

> 이 문서는 CCAF Domain 1을 이해하기 위한 **핵심 개념 허브**다.  
> 여기서는 Agent Loop를 중심으로, `stop_reason`, `tool_use`, `tool_result`가 어떻게 하나의 실행 흐름을 이루는지 설명한다.

## Agent Loop란 무엇인가

Agent Loop는 에이전트가 문제를 해결할 때 사용하는 **반복 실행 구조**다.  
질문을 한 번 받고 바로 답을 끝내는 대신, 필요하면 도구를 호출하고 그 결과를 바탕으로 다시 판단한다.

가장 단순하게 표현하면 다음과 같다.

**입력 → 판단 → 필요 시 도구 호출 → 결과 반영 → 다시 판단 → 완료 시 응답 반환**

즉 에이전트는 단순한 “툴이 달린 챗봇”이 아니라,  
**완료될 때까지 상태를 이어가며 문제를 해결하는 실행 루프**에 가깝다.

---

## 왜 이런 구조가 필요한가

현실의 문제는 한 번의 추론만으로 끝나지 않는 경우가 많다.

예를 들어:
- 최신 GitHub 이슈를 확인해야 하거나
- 고객 정보를 조회해야 하거나
- 외부 문서를 읽고 비교해야 하거나
- 계산, 검증, 파일 수정, 테스트 실행이 필요한 경우

이런 작업은 모델 내부 지식만으로 처리할 수 없다.  
그래서 agentic system은 모델이 **언제 외부 도구가 필요한지 판단**하고,  
그 결과를 받아 다음 행동을 이어가는 구조를 사용한다.

Anthropic도 agents를 단순한 predefined workflow와 구분하면서,  
**모델이 자신의 process와 tool usage를 동적으로 결정하는 시스템**으로 설명한다.

---

## Workflow와 Agent는 어떻게 다른가

Anthropic의 *Building Effective Agents* 글에서는 workflow와 agent를 분명히 구분한다.

- **Workflow**: 코드가 미리 정해 둔 경로를 따라 단계와 도구를 실행하는 구조
- **Agent**: 모델이 상황을 보고 어떤 도구를 쓰고 어떤 단계를 밟을지 동적으로 결정하는 구조

이 구분은 Agent Loop를 이해할 때 중요하다.  
Agent Loop의 핵심은 단순히 여러 단계를 거친다는 데 있지 않다.

핵심은,

> **모델이 현재 문맥을 바탕으로 다음 행동을 스스로 결정한다**는 점

이다.

즉 Agent Loop는
- 고정된 스크립트를 실행하는 흐름이 아니라
- **모델 주도(model-driven)** 실행 흐름이다.

---

## Agent Loop는 어떻게 동작하는가

개념적으로는 아래와 같이 이해하면 된다.

1. 사용자 요청이 들어온다.
2. 시스템이 필요한 문맥을 모은다.
3. 모델이 지금 바로 답할지, 먼저 도구가 필요한지 판단한다.
4. 도구가 필요하면 요청을 만든다.
5. 런타임이 해당 도구를 실행한다.
6. 결과를 다시 모델이 볼 수 있는 문맥에 넣는다.
7. 모델이 다음 행동을 결정한다.
8. 더 이상 도구가 필요 없고 응답이 준비되면 사용자에게 반환한다.

이 흐름은 한 번으로 끝날 수도 있고, 여러 번 반복될 수도 있다.

---

## 루프를 제어하는 신호: `stop_reason`

`stop_reason`은 **모델이 이번 턴에서 왜 멈췄는지**를 알려주는 구조화된 필드다.  
런타임은 이 값을 보고 지금 루프를 계속해야 하는지, 아니면 여기서 종료해도 되는지를 판단한다.

대표적으로:
- `"tool_use"` → 아직 끝난 것이 아니며, 먼저 도구 실행이 필요함
- `"end_turn"` → 이번 턴은 종료 가능

즉 `stop_reason`은 단순한 메타데이터가 아니라,  
**agent loop를 제어하는 신호**에 가깝다.

왜 중요하냐면, 런타임은 절대 이런 식으로 루프를 제어하면 안 되기 때문이다.

- “완료했습니다”라는 문장이 있으면 종료
- 답변이 길어 보이면 종료
- 더 이상 tool 이름이 안 보이면 종료

모델의 자연어 출력은 **비결정적**이다.  
같은 의도도 다른 문장으로 표현될 수 있고, 텍스트만 보고는 상태를 안정적으로 판단할 수 없다.

반면 `stop_reason`은:
- 구조화되어 있고
- 의미가 명확하고
- 코드로 안정적으로 분기할 수 있다

즉:

> **텍스트는 해석 대상이고, `stop_reason`은 제어 신호다.**

개념적으로는 아래처럼 생각하면 된다.

```python
response = call_model(...)

if response.stop_reason == "tool_use":
    run_tool(...)
    append_tool_result(...)
    continue_loop()

elif response.stop_reason == "end_turn":
    return_to_user(...)
```

---

## 외부 행동을 요청하는 방식: `tool_use`

`tool_use`는 모델이 시스템에게  
**“내가 지금 바로 답하지 말고, 먼저 이 도구를 실행해 달라”**  
고 요청하는 메커니즘이다.

중요한 점은, 모델이 도구를 **직접 실행하는 것**이 아니라  
**도구 실행 요청을 구조화된 형태로 내보낸다**는 점이다.

즉 `tool_use`는:
- 모델의 최종 답변이 아니라
- **외부 행동을 요청하는 프로토콜 신호**다.

예를 들어 Claude API 응답은 아래처럼 올 수 있다.

```json
{
  "content": [
    {
      "type": "text",
      "text": "서울 날씨를 확인해볼게요."
    },
    {
      "type": "tool_use",
      "id": "toolu_123",
      "name": "get_weather",
      "input": {
        "location": "서울"
      }
    }
  ],
  "stop_reason": "tool_use"
}
```

여기서 핵심은 두 가지다.

- `type: "tool_use"` → 모델이 `get_weather` 도구 실행을 요청함
- `stop_reason: "tool_use"` → 아직 턴이 끝난 것이 아니라, 먼저 도구 실행이 필요함

즉 이 응답은
> “내가 최종 답을 끝낸 것이 아니라, 이 도구를 먼저 실행해 달라”

는 뜻이다.

실제로는 아래처럼 역할이 나뉜다.

- **모델**: 어떤 도구가 필요한지 판단하고, 어떤 입력으로 호출할지 요청
- **런타임**: 그 요청을 해석하고 실제 도구를 실행
- **모델**: 도구 결과를 다시 받아 다음 행동을 결정

즉 `tool_use`는 실행 그 자체가 아니라,  
**실행을 요청하는 구조화된 인터페이스**다.

---

## 결과를 다시 루프에 넣는 방식: `tool_result`

`tool_result`는 런타임이 실제 도구를 실행한 뒤,  
그 결과를 **다시 모델에게 전달할 때 사용하는 구조화된 입력**이다.

즉 `tool_result`는:
- 단순한 로그 출력이 아니라
- 모델이 다음 행동을 판단할 수 있도록 문맥에 다시 넣는 **결과 전달 메커니즘**이다.

한 문장으로 말하면:

> **`tool_result`는 도구 실행과 다음 추론 사이를 이어주는 연결 고리다.**

이유는 간단하다. 모델이 `tool_use`로 도구 실행을 요청했다고 해서,  
그걸 런타임이 실행만 하고 끝내면 루프가 이어지지 않는다.

모델은 도구 실행 결과를 알아야:
- 답을 바로 끝낼지
- 추가 도구가 더 필요한지
- 결과를 요약할지
- 오류를 복구할지

를 판단할 수 있기 때문이다.

예를 들어 모델이 먼저 이런 응답을 보냈다고 해보자.

```json
{
  "content": [
    {
      "type": "tool_use",
      "id": "toolu_123",
      "name": "get_weather",
      "input": {
        "location": "서울"
      }
    }
  ],
  "stop_reason": "tool_use"
}
```

여기서 런타임은 `get_weather(location="서울")`를 실행한다.

그리고 결과가 아래처럼 나왔다고 하자.

```json
{
  "temperature": "12C",
  "condition": "Cloudy"
}
```

이제 런타임은 이 결과를 다시 모델 문맥에 넣는다.  
개념적으로는 이런 식이다.

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_123",
      "content": "{\"temperature\":\"12C\",\"condition\":\"Cloudy\"}"
    }
  ]
}
```

여기서 핵심은:
- `tool_use_id`로 어떤 요청에 대한 결과인지 연결하고
- 그 결과를 모델이 읽을 수 있는 형태로 다시 넘긴다는 점이다

즉 `tool_result`는 단순 부가 정보가 아니라,  
**루프를 다음 턴으로 이어주는 필수 입력**이다.

---

## 이 개념은 실제로 어디에 구현되는가

여기서 중요한 구분이 하나 있다. `Agent Loop` 자체는 단일 API 필드 이름이 아니라, **Claude API가 제공하는 구조화된 신호를 바탕으로 런타임이 구현하는 실행 패턴**이다.

즉 역할을 나누어 보면 다음과 같다.

- **Claude API**: `tool_use`, `tool_result`, `stop_reason` 같은 프로토콜 요소를 제공
- **런타임(예: Claude Code, OpenClaw)**: 이 신호를 읽고 도구를 실행하거나, 결과를 다시 문맥에 추가하거나, 루프를 종료
- **애플리케이션**: 이 런타임 위에서 실제 사용자 경험과 업무 흐름을 구성

이 구분이 중요한 이유는, 이 개념들이 단순한 설명용 용어가 아니라 **실제 응답 구조 안에 존재하는 프로토콜 요소**라는 점을 보여주기 때문이다.

즉 `Agent Loop`는 추상적인 설명이 아니라,

> **Claude API의 구조화된 신호(`tool_use`, `tool_result`, `stop_reason`) 위에 Claude Code나 OpenClaw 같은 런타임이 구현하는 실제 실행 구조**

라고 이해하는 편이 가장 정확하다.

---

## OpenClaw에서는 Agent Loop가 어떻게 보이는가

OpenClaw 공식 문서는 Agent Loop를 다음과 같이 설명한다.

> **intake → context assembly → model inference → tool execution → streaming replies → persistence**

이 표현이 좋은 이유는 Agent Loop를 단순히 “모델이 툴을 호출하는 과정”으로 좁히지 않고,  
**입력 수집, 문맥 구성, 모델 추론, 도구 실행, 응답 스트리밍, 상태 저장까지 포함한 전체 런타임 흐름**으로 보여주기 때문이다.

OpenClaw 관점에서 보면 Agent Loop는 대략 이렇게 이해할 수 있다.

### 1. Intake
메시지나 명령이 들어온다.

### 2. Context assembly
세션, bootstrap 파일, skills, 관련 메시지 등  
모델이 봐야 할 문맥을 준비한다.

### 3. Model inference
모델이 현재 턴에서 무엇을 할지 결정한다.

### 4. Tool execution
필요하면 런타임이 실제 도구를 실행한다.  
중요한 점은 **모델이 도구를 직접 실행하는 것이 아니라, 런타임이 실행한다**는 것이다.

### 5. Streaming replies
중간 결과나 최종 응답이 스트리밍될 수 있다.

### 6. Persistence
세션 상태와 실행 결과를 저장해 다음 턴과의 일관성을 유지한다.

OpenClaw 문서에 따르면 이 루프는 **세션당 serialized run**으로 다뤄진다.  
즉 한 세션 안에서 실행이 엉키거나 히스토리가 꼬이지 않도록,  
런 단위로 순서를 보장하는 구조를 가진다.

이 점은 실무적으로 중요하다.  
Agent Loop는 단순한 추론 반복이 아니라,  
**상태 일관성과 실행 순서까지 포함한 런타임 설계 문제**이기도 하기 때문이다.

---

## 실무에서 왜 중요한가

Agent Loop를 이해하면 아래 같은 판단이 쉬워진다.

- 왜 종료를 자연어 문장으로 추측하면 안 되는가
- 왜 도구 요청과 실제 도구 실행을 구분해야 하는가
- 왜 도구 실행 결과를 다시 모델 문맥에 넣어야 하는가
- 왜 루프가 “생각 → 실행 → 생각” 구조가 되는가
- 왜 런타임이 세션, 큐, 락 같은 상태 관리 계층을 갖는가

즉 Agent Loop는 Domain 1의 출발점이면서,  
뒤에 나오는 거의 모든 개념의 기반이 된다.

- [[concepts/agent-control/coordinator-subagent|Coordinator / Subagent]]는 **loop를 역할별로 나눈 것**
- [[concepts/agent-control/hooks-and-enforcement|Hooks]]는 **loop 중간에 개입하는 장치**
- [[concepts/state-memory/session-management|Session management]]는 **loop가 길어졌을 때 일관성을 유지하는 방식**

으로 이해할 수 있다.

---

## 자주 하는 오해

### 오해 1. Agent는 그냥 tool이 붙은 챗봇이다
중요한 것은 tool의 존재 자체보다 **반복 실행 구조와 상태 기반 판단**이다.

### 오해 2. 모델이 tool을 직접 실행한다
모델은 도구 실행을 **요청**하고, 실제 실행은 런타임이 담당한다.

### 오해 3. 응답이 길어 보이면 loop가 끝난 것이다
루프 종료는 자연어가 아니라 `stop_reason` 같은 **구조화된 신호**를 기준으로 판단해야 한다.

---

## 한 문장 요약

> **Agent Loop는 모델이 구조화된 신호(`stop_reason`, `tool_use`, `tool_result`)를 통해 외부 도구와 상호작용하며, 완료될 때까지 반복적으로 판단을 이어가는 실행 구조다.**

---

## 더 읽어보기

### Anthropic
- Tool Use with Claude  
  <https://docs.anthropic.com/en/docs/build-with-claude/tool-use>
- Building Effective Agents  
  <https://www.anthropic.com/engineering/building-effective-agents>

### OpenClaw
- Agent Loop (OpenClaw)  
  <https://docs.openclaw.ai/concepts/agent-loop>
- OpenClaw GitHub Repository  
  <https://github.com/openclaw/openclaw>
