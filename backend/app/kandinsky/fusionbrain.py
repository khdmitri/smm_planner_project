import base64
import json
import time

import httpx
import requests
from httpx import AsyncClient

API_KEY = "95167DD8D7786E7A4116BD66FC663B01"
API_SECRET = "C101E18AB241BD6EFA83263BB60AA3C2"
URL = "https://api-key.fusionbrain.ai/"


class Text2ImageAPI:

    def __init__(self):
        timeout = httpx.Timeout(60.0, connect=30.0)
        self.session: AsyncClient = AsyncClient(timeout=timeout)
        self.URL = URL
        self.AUTH_HEADERS = {
            'X-Key': f'Key {API_KEY}',
            'X-Secret': f'Secret {API_SECRET}',
        }

    async def _get_model(self):
        response = await self.session.get(self.URL + 'key/api/v1/models', headers=self.AUTH_HEADERS)
        data = response.json()
        return data[0]['id']

    async def _generate(self, prompt, model, images=1, width=1024, height=1024,
                        style="DEFAULT", negative_prompt_unclip=""):
        params = {
            "type": "GENERATE",
            "numImages": images,
            "width": width,
            "height": height,
            "style": style,
            "negativePromptUnclip": negative_prompt_unclip,
            "generateParams": {
                "query": f"{prompt}"
            }
        }

        print("Try to send data with params:", params)

        data = {
            'model_id': (None, str(model)),
            'params': (None, json.dumps(params), 'application/json')
        }
        response = await self.session.post(self.URL + 'key/api/v1/text2image/run', headers=self.AUTH_HEADERS,
                                           files=data)
        data = response.json()
        return data['uuid']

    async def _check_generation(self, request_id, attempts=10, delay=10):
        data = dict()
        data["status"] = "INIT"
        while attempts > 0:
            response = await self.session.get(self.URL + 'key/api/v1/text2image/status/' + request_id,
                                              headers=self.AUTH_HEADERS)
            data = response.json()
            if data['status'] == 'DONE':
                true_images = list()
                for image in data["images"]:
                    true_images.append("data:image/jpg;base64,"+image)
                return true_images, {"success": True}

            attempts -= 1
            time.sleep(delay)
        return None, {"success": False, "error": data['status']}

    async def execute(self, prompt, style="DEFAULT", num_images=1, width=1024, height=1024, negative_prompt_unclip=""):
        model_id = await self._get_model()
        uuid = await self._generate(prompt, model_id, num_images, width=width, height=height, style=style,
                                    negative_prompt_unclip=negative_prompt_unclip)
        return await self._check_generation(uuid)


# if __name__ == '__main__':
#     api = Text2ImageAPI('https://api-key.fusionbrain.ai/', '95167DD8D7786E7A4116BD66FC663B01',
#                         'C101E18AB241BD6EFA83263BB60AA3C2')
#     model_id = await api.get_model()
#     uuid = await api.generate("Yoga meditation with coach", model_id)
#     images = await api.check_generation(uuid)
#     i = 0
#     for image in images:
#         i += 1
#         image_base64 = image
#         image_data = base64.b64decode(image_base64)
#         with open("image_"+str(i)+".jpg", "wb") as file:
#             file.write(image_data)
