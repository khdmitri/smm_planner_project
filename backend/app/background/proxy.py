import asyncio
import logging
import random

from fastapi import HTTPException
from httpx import AsyncClient

from app.common.logger import get_logger
from app.background.db.database import database_instance

logger = get_logger(logging.INFO)

PROXY_BASE_URL = "https://api.proxyscrape.com/v2/"
params = {
    "request": "displayproxies",
    "timeout": 10000,
    "country": "all",
    "ssl": "no",
    "anonymity": "all",
}


class ProxyManager:
    def __init__(self, async_client):
        self.async_client: AsyncClient = async_client
        self.proxy_list = {
            "http": [],
            "https": []
        }

    async def _get_current_list(self, protocol):
        stmt_list = "SELECT address FROM proxy WHERE protocol={protocol}"
        result_db = await database_instance.fetch_rows(stmt_list, named_args={"protocol": protocol})
        self.proxy_list[protocol] = []
        for item in result_db:
            self.proxy_list[protocol].append(item["address"])

    async def get_random_proxy(self, protocol):
        if len(self.proxy_list[protocol]) == 0:
            await self._get_current_list(protocol)

        proxy_size = len(self.proxy_list[protocol])
        if proxy_size > 0:
            random_ind = random.randint(0, proxy_size-1)
            return self.proxy_list[protocol][random_ind]
        else:
            return None

    async def remove_proxy(self, address):
        for key in self.proxy_list.keys():
            try:
                self.proxy_list[key].remove(address)
                stmt_delete_item = "DELETE FROM proxy WHERE address={address}"
                await database_instance.execute(stmt_delete_item, named_args={"address": address})
            except ValueError:
                pass

    async def _clean_data_in_db(self, protocol):
        delete_stmt = "DELETE FROM proxy WHERE protocol={protocol}"
        await database_instance.execute(delete_stmt, named_args={"protocol": protocol})
        return True

    async def _insert_item(self, *, protocol, address):
        insert_stmt = "INSERT INTO proxy (address, protocol) VALUES ({address}, {protocol})"
        await database_instance.execute(insert_stmt, named_args={"address": address, "protocol": protocol})

    async def request_new_list(self, protocol):
        params["protocol"] = protocol
        request_result = await self.async_client.request("get", PROXY_BASE_URL, params=params)
        if request_result.status_code > 201:
            raise HTTPException(status_code=request_result.status_code)
        new_list = request_result.text.split("\r\n")
        await self._clean_data_in_db(protocol)
        for item in new_list:
            await self._insert_item(protocol=protocol, address=item)

    async def test_proxy_provider(self, protocol):
        test_params = {
            "type": protocol,
        }
        url = "https://www.proxy-list.download/api/v1/get"
        request_result = await self.async_client.request("get", url, params=test_params)
        return request_result


async def main():
    ctx = AsyncClient()
    proxy_inst = ProxyManager(ctx)
    try:
        # await proxy_inst.request_new_list("http")
        # await proxy_inst.request_new_list("https")
        result = await proxy_inst.test_proxy_provider("https")
        print(result)
    except HTTPException as error:
        logger.error(f"Error when request proxy list: {str(error.status_code)}")
    finally:
        await ctx.aclose()

if __name__ == '__main__':
    asyncio.run(main())
