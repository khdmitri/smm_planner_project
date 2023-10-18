from random import randint

from app.core.chatGpt.active_providers import ActiveProviders
from g4f import ChatCompletion
from g4f.Provider import ProviderUtils


MAX_ATTEMPTS = 10


class GptStateSingleton(object):
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(GptStateSingleton, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        self.providers = self._set_providers()
        self.provider_list = self._set_provider_list()

    def get_providers(self):
        return self.providers

    def _set_providers(self):
        return ActiveProviders.get_providers()

    def _set_provider_list(self):
        provider_list = []
        for provider_key in self.providers.keys():
            provider_list.append(provider_key)

        return provider_list

    def _get_next_provider(self, failed=None):
        if failed is not None:
            if failed in self.provider_list:
                self.provider_list.remove(failed)
            if failed in self.providers.keys():
                del self.providers[failed]
        if len(self.provider_list) == 0:
            self.providers = self._set_providers()
            self.provider_list = self._set_provider_list()

        ind = randint(0, len(self.provider_list)-1)
        return self.provider_list[ind]

    async def _try_request(self, provider_name, model, conversation_id, messages):
        response = None
        success = True
        try:
            if provider_name:
                provider_class = ProviderUtils.convert[provider_name]
                if hasattr(provider_class, "supports_gpt_4") and provider_class.supports_gpt_4:
                    model = "gpt-4"
                else:
                    model = "gpt-3.5-turbo"
                response = await ChatCompletion.create_async(
                    provider=provider_class,
                    model=model,
                    chatId=conversation_id,
                    messages=messages,
                )
            else:
                response = await ChatCompletion.create_async(
                    model=model,
                    chatId=conversation_id,
                    messages=messages,
                )

            if not response:
                success = False
        except Exception:
            success = False
        return response, success

    async def get_answer(self, provider_name, model, conversation_id, messages):
        current_provider = provider_name
        response, success = await self._try_request(provider_name, model, conversation_id, messages)
        attempts = 0
        while not success and attempts < MAX_ATTEMPTS:
            attempts += 1
            current_provider = self._get_next_provider(failed=provider_name)
            response, success = await self._try_request(current_provider, model, conversation_id, messages)

        return {
            "answer": response,
            "success": success,
            "provider": current_provider
        }
