import g4f


# from app.core.utils import without_keys
# from g4f.Provider import ProviderUtils


class ActiveProviders:
    # @staticmethod
    # def _get_provider_list():
    #     providers = ProviderUtils.convert
    #     remove_objects = ["AsyncGeneratorProvider", "AsyncProvider", "BaseProvider", "RetryProvider"]
    #     return without_keys(providers, remove_objects)

    @staticmethod
    def get_providers():
        providers = {}
        providers_list = [
            {provider.__name__: {"gpt_35_turbo": provider.supports_gpt_35_turbo,
                                 "gpt_4": provider.supports_gpt_4,
                                 "isFailed": False}}
            for provider in g4f.Provider.__providers__
            if provider.working
        ]

        for provider in providers_list:
            providers.update(provider)

        return providers
        # active_providers = {}
        # providers = ActiveProviders._get_provider_list()
        # for provider_key in providers.keys():
        #     if hasattr(providers[provider_key], "working"):
        #         provider_class = providers[provider_key]
        #         if provider_class.working:
        #             active_providers[provider_key] = {
        #                 "gpt_35_turbo": provider_class.supports_gpt_35_turbo if hasattr(
        #                     provider_class, "supports_gpt_35_turbo") else False,
        #                 "gpt_4": provider_class.supports_gpt_4 if hasattr(
        #                     provider_class, "supports_gpt_4") else False,
        #                 "isFailed": False
        #             }
        #
        # return active_providers


if __name__ == '__main__':
    print(ActiveProviders.get_providers())
