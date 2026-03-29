# tool_result

> 이 문서는 CCAF Domain 1을 이해하기 위한 **개념 설명용 노트**다.  
> 여기서는 `tool_result`를 단순한 “도구 실행 결과”가 아니라, **agent loop가 다음 판단으로 이어지도록 만드는 구조화된 입력**으로 이해하는 데 초점을 둔다.
>
> 먼저 읽으면 좋은 순서:
> **[Agent Loop](./agent-loop.md) → [stop_reason](./stop-reason.md) → [tool_use](./tool-use.md) → tool_result**

## `tool_result`란 무엇인가

`tool_result`는 런타임이 실제 도구를 실행한 뒤,  
그 결과를 **다시 모델에게 전달할 때 사용하는 구조화된 입력**이다.

즉 `tool_result`는:
- 단순한 로그 출력이 아니라
- 모델이 다음 행동을 판단할 수 있도록 문맥에 다시 넣는 **결과 전달 메커니즘**이다.

한 문장으로 말하면:

> **`tool_result`는 도구 실행과 다음 추론 사이를 이어주는 연결 고리다.**

---

## 왜 필요한가

모델이 `tool_use`로 도구 실행을 요청했다고 해서,  
그걸 런타임이 실행만 하고 끝내면 루프가 이어지지 않는다.

모델은 도구 실행 결과를 알아야:
- 답을 바로 끝낼지
- 추가 도구가 더 필요한지
- 결과를 요약할지
- 오류를 복구할지

를 판단할 수 있기 때문이다.

즉 `tool_result`는 단순히 “실행 결과를 남기는 것”이 아니라,

> **모델이 다음 결정을 내릴 수 있게 만드는 입력**

이다.

---

## `tool_use`와는 어떻게 연결되는가

이 둘은 거의 세트다.

### `tool_use`
모델이:
> “이 도구를 이 입력으로 실행해 달라”
고 요청하는 단계

### `tool_result`
런타임이:
> “요청한 도구를 실행했고, 결과는 이거다”
라고 모델에게 돌려주는 단계

즉 흐름은 이렇게 된다.

1. 모델이 `tool_use` 요청
2. 런타임이 실제 도구 실행
3. 런타임이 `tool_result`를 문맥에 추가
4. 모델이 그 결과를 바탕으로 다음 판단

이 흐름이 있어야 agent loop가 실제로 굴러간다.

---

## 실제 API 흐름에서는 어떻게 보이는가

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

## 왜 결과를 다시 모델 문맥에 넣어야 하나

이게 `tool_result`의 핵심이다.

런타임이 도구를 실행해서 결과를 “알고 있다”는 것만으로는 부족하다.  
모델도 그 결과를 알아야 다음 행동을 결정할 수 있다.

예를 들어:
- 날씨 API 결과를 보고 최종 답을 할 수도 있고
- 파일 내용을 읽고 다시 grep이나 edit를 할 수도 있고
- GitHub 조회 결과를 보고 추가 API 호출을 할 수도 있다

즉:
> **도구 실행 결과가 모델에게 다시 들어가지 않으면, agent는 자기 행동의 결과를 모르는 상태가 된다.**

그 상태에서는 제대로 된 연속 추론이 어렵다.

---

## 런타임은 `tool_result`를 가지고 무엇을 하나

런타임은 보통 이렇게 움직인다.

1. 모델 응답에서 `tool_use`를 찾는다
2. 실제 도구를 실행한다
3. 결과를 `tool_result` 형태로 문맥에 추가한다
4. 다시 모델을 호출한다
5. `stop_reason`에 따라 종료하거나 다음 턴으로 넘어간다

개념적으로는 이런 식이다.

```python
response = call_model(...)

if response.stop_reason == "tool_use":
    tool_call = extract_tool_use(response)
    result = run_tool(tool_call)
    append_tool_result(result)
    response = call_model(...)
```

즉 `tool_result`는 루프를 다시 시작시키는 재료다.

---

## OpenClaw 같은 런타임에서는 어떤 의미가 있나

OpenClaw 같은 런타임에서는 모델이:
- `read`
- `edit`
- `exec`
- `sessions_*`

같은 도구를 요청하면,  
실제 작업은 런타임이 수행한다.

그 다음 중요한 건:
- 실행 결과를 그냥 버리지 않고
- 다시 다음 턴 문맥에 넣어서
- 모델이 이어서 판단하게 만든다는 점이다

예를 들어:
- 파일을 읽은 뒤 그 내용을 보고 수정 계획을 세울 수도 있고
- 명령 실행 결과를 보고 다음 디버깅 단계를 정할 수도 있고
- 다른 세션 조회 결과를 보고 후속 메시지를 보낼 수도 있다

즉 OpenClaw 같은 런타임에서 `tool_result`는  
**도구 실행을 “생각 가능한 정보”로 되돌려주는 역할**을 한다.

---

## 실무에서 왜 중요한가

`tool_result`를 이해하면 아래가 명확해진다.

- 왜 도구 실행만으로 agent loop가 완성되지 않는가
- 왜 결과를 구조화해서 다시 모델에게 전달해야 하는가
- 왜 tool 호출 실패 시 structured error가 중요한가
- 왜 루프가 “생각 → 실행 → 생각” 구조가 되는가

많은 사람이 agent를
- “모델이 도구를 부르는 것”
까지만 이해하는데,

실제로는
> **도구 결과가 다시 모델에게 들어와야 agent가 자기 행동을 반영하며 계속 생각할 수 있다**
는 점이 핵심이다.

---

## 자주 하는 오해

### 오해 1. 도구 실행 결과는 런타임만 알면 된다
아니다.  
모델도 그 결과를 알아야 다음 행동을 결정할 수 있다.

### 오해 2. `tool_result`는 그냥 로그 같은 것이다
아니다.  
이건 다음 추론을 위한 **실제 입력**이다.

### 오해 3. `tool_use`만 이해하면 루프를 안다
아니다.  
`tool_use` 뒤에 `tool_result`가 들어와야 루프가 닫힌다.

### 오해 4. 결과는 꼭 성공한 것만 보내면 된다
아니다.  
실패나 빈 결과도 구조화해서 전달해야 모델이 복구나 후속 판단을 할 수 있다.

---

## 한 문장 요약

> **`tool_result`는 런타임이 도구 실행 결과를 다시 모델에게 전달하는 구조화된 입력이며, agent loop가 다음 판단으로 이어지게 만드는 핵심 연결 고리다.**

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
