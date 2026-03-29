# stop_reason

> 이 문서는 CCAF Domain 1을 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 `stop_reason`을 시험 용어가 아니라, **Claude API가 제공하는 실제 제어 신호**로 이해하는 데 초점을 둔다.

## `stop_reason`이란 무엇인가

`stop_reason`은 **모델이 이번 턴에서 왜 멈췄는지**를 알려주는 구조화된 필드다.  
런타임은 이 값을 보고 지금 루프를 계속해야 하는지, 아니면 여기서 종료해도 되는지를 판단한다.

즉 `stop_reason`은 단순한 메타데이터가 아니라,  
**agent loop를 제어하는 신호**에 가깝다.

---

## 왜 필요한가

Agent Loop에서는 모델이 한 번의 응답으로 끝나지 않을 수 있다.  
어떤 경우에는 도구를 먼저 실행해야 하고, 어떤 경우에는 이미 최종 응답이 준비되어 있을 수 있다.

이때 런타임은 다음 둘 중 하나를 결정해야 한다.

- **계속 진행**: 도구를 실행하고 다음 턴으로 넘어간다
- **종료**: 사용자에게 최종 응답을 반환한다

`stop_reason`은 바로 이 결정을 위해 존재한다.

---

## 실제 API 응답에서 어떻게 보이는가

예를 들어 Claude API 응답이 아래처럼 왔다고 해보자.

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

이 응답이 의미하는 것은 분명하다.

- `content` 안에 `tool_use`가 있음
- `stop_reason`도 `"tool_use"`임

즉 모델은:

> “내가 지금 최종 답을 끝낸 게 아니라, 먼저 도구 실행이 필요하다”

는 신호를 보낸 것이다.

반대로 최종 응답이 준비된 경우에는 이런 식으로 올 수 있다.

```json
{
  "content": [
    {
      "type": "text",
      "text": "현재 서울은 흐리고 약 12도입니다."
    }
  ],
  "stop_reason": "end_turn"
}
```

이 경우 런타임은:

> “이번 턴은 여기서 끝내도 된다”

고 해석하면 된다.

---

## `tool_use`와 `end_turn`는 각각 무엇을 뜻하는가

### `stop_reason: "tool_use"`
이 값은 **도구 실행이 먼저 필요하다**는 뜻이다.  
런타임은 보통 다음 순서로 움직인다.

1. 응답 안의 `tool_use` 블록을 확인한다
2. 요청된 도구를 실행한다
3. 결과를 다시 모델 문맥에 추가한다
4. 다음 턴을 이어간다

즉 이 값은 **계속 진행 신호**다.

### `stop_reason: "end_turn"`
이 값은 모델이 이번 턴에서 할 일을 마쳤고,  
이제 **응답을 사용자에게 반환해도 된다**는 뜻이다.

즉 이 값은 **종료 신호**다.

---

## 런타임은 이 값을 보고 무엇을 하는가

여기서 중요한 점은, `stop_reason`이 사람이 읽고 참고하는 설명이 아니라  
**Claude Code, OpenClaw 같은 런타임이 실제로 분기 처리에 사용하는 값**이라는 점이다.

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

즉 `stop_reason`은:
- 루프를 계속할지
- 종료할지
를 가르는 **제어 분기점**이다.

---

## 왜 assistant 텍스트를 파싱하면 안 되는가

이 부분이 실무에서도 시험에서도 중요하다.

런타임은 절대 이런 식으로 루프를 제어하면 안 된다.

- “완료했습니다”라는 문장이 있으면 종료
- 답변이 길어 보이면 종료
- 더 이상 tool 이름이 안 보이면 종료

왜냐면 모델의 자연어 출력은 **비결정적**이기 때문이다.  
같은 의도도 다른 문장으로 표현될 수 있고, 텍스트만 보고는 상태를 안정적으로 판단할 수 없다.

반면 `stop_reason`은:
- 구조화되어 있고
- 의미가 명확하고
- 코드로 안정적으로 분기할 수 있다

즉:

> **텍스트는 해석 대상이고, `stop_reason`은 제어 신호다.**

---

## OpenClaw 같은 런타임에서는 왜 중요할까

OpenClaw 같은 런타임은 단순히 모델 답변만 보여주는 게 아니라, 세션 상태를 유지하고, 도구를 실행하고, 결과를 저장하고, 다음 턴으로 이어간다.

이런 환경에서는 특히:
- 잘못된 시점에 루프를 끝내면 안 되고
- 필요한 도구 실행을 건너뛰면 안 되고
- 세션 히스토리가 꼬이면 안 된다

그래서 `stop_reason` 같은 구조화된 신호가 중요하다.  
이 값이 있어야 런타임이 **텍스트 추측이 아니라 명시적 상태**를 기준으로 동작할 수 있다.

Agent Loop 문서에서 본 것처럼, OpenClaw는 intake부터 persistence까지 전체 실행 흐름을 관리한다.  
그런 런타임에서 `stop_reason`은 “지금 이 실행을 계속할지 끝낼지”를 판단하는 핵심 기준 중 하나다.

---

## 자주 하는 오해

### 오해 1. `stop_reason`은 그냥 참고용 필드다
아니다.  
이건 실제로 런타임이 루프를 제어할 때 쓰는 핵심 신호다.

### 오해 2. assistant가 “끝났다”고 말하면 그게 종료다
아니다.  
종료 여부는 자연어가 아니라 **`stop_reason`**으로 판단해야 한다.

### 오해 3. 반복 횟수 제한만 있으면 충분하다
아니다.  
반복 제한은 안전장치일 수는 있지만, **주된 종료 기준**이 되어서는 안 된다.

### 오해 4. `tool_use`와 `stop_reason`은 같은 것이다
완전히 같지는 않다.  
- `tool_use`는 **도구 호출 요청**
- `stop_reason`은 **왜 멈췄는지에 대한 상태 신호**
다만 둘은 실제 루프에서 매우 밀접하게 연결된다.

---

## 한 문장 요약

> **`stop_reason`은 모델이 이번 턴에서 왜 멈췄는지를 알려주는 구조화된 제어 신호이며, 런타임은 이를 기준으로 루프를 계속할지 종료할지를 결정한다.**

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
