import traceback

import g4f
from g4f import ProviderNotWorkingError

allowed_models = [
    'code-davinci-002',
    'text-ada-001',
    'text-babbage-001',
    'text-curie-001',
    'text-davinci-002',
    'text-davinci-003'
]

try:
    response = g4f.Completion.create(
        model='text-davinci-003',
        prompt='say this is a test'
    )
    print(response)
except ProviderNotWorkingError:
    print(traceback.format_exc())
