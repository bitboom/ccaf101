# tool_use

> 이 문서는 CCAF Domain 1을 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 `tool_use`를 단순한 용어가 아니라, **Claude API 응답 안에 실제로 나타나는 프로토콜 요소**로 이해하는 데 초점을 둔다.
>
> 먼저 읽으면 좋은 순서:
> **[Agent Loop](./agent-loop.md) → [stop_reason](./stop-reason.md) → tool_use**

## `tool_use`란 무엇인가

`tool_use`는 모델이 시스템에게  
**“내가 지금 바로 답하지 말고, 먼저 이 도구를 실행해 달라”**  
고 요청하는 메커니즘이다.

중요한 점은, 모델이 도구를 **직접 실행하는 것**이 아니라  
**도구 실행 요청을 구조화된 형태로 내보낸다**는 점이다.

즉 `tool_use`는:
- 모델의 최종 답변이 아니라
- **외부 행동을 요청하는 프로토콜 신호**다.

---

## 왜 필요한가

모델은 모든 문제를 내부 지식만으로 해결할 수 없다.

예를 들어:
- 현재 날씨를 확인하거나
- GitHub 이슈를 조회하거나
- 파일을 읽거나
- 테스트를 실행하거나
- 고객 정보를 확인하는 일은

실제 외부 시스템이나 도구와 연결되어야 한다.

이때 `tool_use`는 모델이
> **“이 문제를 풀려면 이 도구가 먼저 필요하다”**

고 판단했을 때 사용하는 방식이다.

즉 `tool_use`는 모델의 한계를 드러내는 것이 아니라,  
**모델을 실제 실행 환경과 연결하는 핵심 메커니즘**이다.

---

## 실제 API 응답에서 어떻게 보이는가

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

---

## 모델이 직접 실행하는 게 아니라는 말의 의미

이 부분이 가장 많이 헷갈린다.

`tool_use`가 나왔다고 해서 모델이 직접:
- API를 호출하거나
- 셸 명령을 실행하거나
- 파일을 읽는 것은 아니다.

실제로는 아래처럼 역할이 나뉜다.

- **모델**: 어떤 도구가 필요한지 판단하고, 어떤 입력으로 호출할지 요청
- **런타임**: 그 요청을 해석하고 실제 도구를 실행
- **모델**: 도구 결과를 다시 받아 다음 행동을 결정

즉 `tool_use`는 실행 그 자체가 아니라,  
**실행을 요청하는 구조화된 인터페이스**다.

---

## `tool_use` 다음에는 무엇이 일어나는가

런타임은 `tool_use`를 받으면 보통 다음 순서로 움직인다.

1. 어떤 도구를 요청했는지 확인한다
2. 입력 인자를 확인한다
3. 실제 도구를 실행한다
4. 결과를 `tool_result` 형태로 다시 모델 문맥에 넣는다
5. 모델이 그 결과를 바탕으로 다음 판단을 한다

즉 `tool_use`는 단독 이벤트가 아니라,  
**`tool_result`와 이어지는 루프의 중간 단계**다.

---

## `stop_reason`과는 어떻게 다른가

`tool_use`와 `stop_reason`은 밀접하게 연결되지만 같은 것은 아니다.

### `tool_use`
- **무슨 행동이 필요한지**를 나타냄
- 예: `get_weather`, `read_file`, `run_test`

### `stop_reason`
- **왜 이번 턴이 여기서 멈췄는지**를 나타냄
- 예: `"tool_use"`, `"end_turn"`

즉:
- `tool_use`는 **도구 호출 요청**
- `stop_reason`은 **제어 신호**

다만 실제로는 `tool_use` 요청이 나올 때 `stop_reason`도 `"tool_use"`로 함께 오는 경우가 많다.

---

## OpenClaw 같은 런타임에서는 어떻게 보이는가

OpenClaw 같은 런타임에서는 모델이 tool call을 요청하면,  
런타임이 그 요청을 해석해서 실제 도구를 실행한다.

예를 들어 OpenClaw에서 모델이:
- `read`
- `edit`
- `exec`
- `sessions_*`

같은 도구를 요청하면, 실제 파일 읽기나 명령 실행은 OpenClaw 런타임이 담당한다.

즉 OpenClaw 관점에서 `tool_use`는:
- 모델이 외부 작업을 요청하는 지점이고
- 런타임이 실제 행동으로 바꿔주는 지점이다

이런 구조 덕분에 Agent Loop는 단순한 텍스트 생성이 아니라,  
**도구 사용과 상태 업데이트를 포함하는 실행 흐름**이 된다.

---

## 실무에서 왜 중요한가

`tool_use`를 이해하면 아래 같은 점이 명확해진다.

- 왜 모델이 직접 시스템 명령을 실행하지 않는가
- 왜 도구 설명(tool description)이 중요한가
- 왜 tool 결과를 다시 모델에게 넘겨야 하는가
- 왜 tool 호출 실패 시 structured error가 중요해지는가

즉 `tool_use`는 단순히 “도구를 쓴다”는 말보다 훨씬 구체적이다.  
이건 런타임, tool schema, 결과 전달, 루프 제어까지 이어지는 핵심 연결점이다.

---

## 자주 하는 오해

### 오해 1. `tool_use`가 나오면 모델이 직접 도구를 실행한 것이다
아니다.  
모델은 실행을 요청할 뿐이고, 실제 실행은 런타임이 한다.

### 오해 2. `tool_use`는 한 번만 일어난다
아니다.  
하나의 작업에서 여러 번 연속으로 발생할 수 있다.

### 오해 3. `tool_use`는 모델이 답을 몰라서 쓰는 것이다
절반만 맞다.  
정확히는 **외부 정보나 실제 실행이 필요한 문제를 해결하기 위해 쓰는 것**이다.

### 오해 4. `tool_use`만 보면 루프 제어가 된다
아니다.  
루프를 계속할지 끝낼지는 `stop_reason`까지 함께 봐야 한다.

---

## 한 문장 요약

> **`tool_use`는 모델이 시스템에게 특정 도구 실행을 요청하는 구조화된 프로토콜 요소이며, 런타임은 이를 실제 실행으로 바꾸고 그 결과를 다시 모델에 전달한다.**

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
