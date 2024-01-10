import g4f

# Print all available providers
print([
    {"name": provider.__name__, "Is Working": provider.working}
    for provider in g4f.Provider.__providers__
    if provider.working
])

print(g4f.Provider.AiChatOnline.params)

# Execute with a specific provider
response = g4f.ChatCompletion.create(
    model="gpt-3.5-turbo",
    provider=g4f.Provider.AiChatOnline,
    messages=[{"role": "user", "content": "Hello"}],
    stream=True,
)
for message in response:
    print(message)
