from abc import ABCMeta
from typing import List

import g4f
from g4f.Provider import RetryProvider
from g4f.Provider   import (
    Chatgpt4Online,
    ChatgptDemoAi,
    ChatgptNext,
    HuggingChat,
    ChatgptDemo,
    GptForLove,
    ChatgptAi,
    DeepInfra,
    OnlineGpt,
    ChatBase,
    Liaobots,
    GeekGpt,
    FakeGpt,
    FreeGpt,
    Berlin,
    Llama2,
    Vercel,
    Phind,
    Koala,
    GptGo,
    Gpt6,
    Bard,
    Bing,
    You,
    H2o,
    Pi,
)


result: RetryProvider = RetryProvider([Bing, You])
print(result.providers[0].working)
