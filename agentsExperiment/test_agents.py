from langer import GetLangRequest, GetLangResponse
from uagents.query import query
import json
import asyncio
from aiohttp import ClientSession


LANGER_ADDRESS = "agent1qt8xgt2hdukrm4a6gh6vev6c2cgftvfrdql33tda9lpm04vk4jtlvn72p9f"

async def agent_query(req):
    async with ClientSession(trust_env=True) as session:
        response = await query(destination=LANGER_ADDRESS, message=GetLangRequest(question=req), timeout=15.0)
    print(response)
    return json.loads(response.decode_payload())

async def make_llm_call():
    query = "Hey LLM, what foods should I eat if I am low in iron?"
    data = await (agent_query(query))
    print("Final", data)

asyncio.run(make_llm_call())
