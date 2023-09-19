from facebook import GraphAPI

proxies = {
    "http": "43.156.0.125:8888",
    "https": "58.234.116.197:8193",
}

# Group
# graph_test = GraphAPI(
#     access_token="EAAPZAzEIdmDQBO4P7ZClvpK1PurxKacSu8ZAYgaCYAONhrfXqqWXxWVc3Ixfh2tHWHxa2r3so695QMhfdDvDr7oLYJuhi1yql5fvuhr8hMrO8FUZCRlSho1u5l562cHWFYFRYVKZCXo07SbdcbzOmGdSEOwSzHjVobeSPyKw3YAV5FIQWZB8Q7xgRe",
#     version="3.1",
#     proxies=proxies
# )

# Self WALL
graph_test = GraphAPI(
    access_token="EAAPZAzEIdmDQBO4P7ZClvpK1PurxKacSu8ZAYgaCYAONhrfXqqWXxWVc3Ixfh2tHWHxa2r3so695QMhfdDvDr7oLYJuhi1yql5fvuhr8hMrO8FUZCRlSho1u5l562cHWFYFRYVKZCXo07SbdcbzOmGdSEOwSzHjVobeSPyKw3YAV5FIQWZB8Q7xgRe",
    version="3.1",
    proxies=proxies
)


class MetaQueue:
    def __init__(self):
        pass

    def send_message_test(self):
        # print(graph_test.get_permissions("me"))
        # me = graph_test.get_object("me")
        # graph_test.put_object(parent_object="100087997959916", connection_name='feed',
        #                       message='Hello, world')
        graph_test.put_object("me", "feed",
                              message="This is automated post.",
                              link="https://www.facebook.com"
                              )


if __name__ == '__main__':
    meta_inst = MetaQueue()
    meta_inst.send_message_test()
