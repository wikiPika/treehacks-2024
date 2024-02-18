from shop import ShopRequest, ShopResponse
from food_query import (
    QueryFoodRequest,
    QueryFoodResponse,
)
from typing import List
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
 
MARKET_ADDRESS = "???"
PROXY_ADDRESS = "???" 

shopper = Agent(
    name="shopper",
    port=8000,
    seed="fudu shopper",
    endpoint=["http://127.0.0.1:8000/submit"],
)
 
fund_agent_if_low(shopper.wallet.address())


class LoadAgentRequest(Model):
    items: List[str]
    budget: int

class ReadAgentRequest(Model):
    empty: str
 
class ReadAgentResponse(Model):
    items: List[str]
    quants: List[int]
    spent: int

@shopper.on_message(ShopResponse)
async def handle_shop_response(ctx: Context, sender: str, msg: ShopResponse):
    budget = ctx.storage.get('budget')
    ctx.storage.set('budget', budget - msg.cost)
    ctx.storage.set('spent', msg.cost)

@shopper.on_query(LoadAgentRequest, replies=QueryFoodRequest)
async def handle_load_request(ctx: Context, sender: str, msg: LoadAgentRequest):
    ctx.storage.set('budget', msg.budget)
    ctx.storage.set('done', False)
    await ctx.send(MARKET_ADDRESS, QueryFoodRequest(msg.items))

@shopper.on_query(ReadAgentRequest, replies=ReadAgentResponse)
async def handle_read_request(ctx: Context, sender: str, msg: LoadAgentRequest):
    while not ctx.storage.get('done'):
        continue

    spent = ctx.storage.get('spent')
    bought_items = ctx.storage.get('bought_items')
    bought_quants = ctx.storage.get('bought_quants')
    await ctx.send(sender, ReadAgentResponse(spent=spent, items=bought_items, quants=bought_quants))



 
@shopper.on_message(QueryFoodResponse, replies=ShopRequest)
async def handle_query_response(ctx: Context, sender: str, msg: LoadAgentRequest):

    if len(msg.tables) > 0:
        ctx.logger.info("There is a free table, attempting to book one now")
 
        table_number = msg.tables[0]
 
        request = BookTableRequest(
            table_number=table_number,
            time_start=table_query.time_start,
            duration=table_query.duration,
        )
 
        await ctx.send(sender, request)
 
    else:
 
        ctx.logger.info("No free tables - nothing more to do")
        ctx.storage.set("completed", True)
 
@user.on_message(BookTableResponse, replies=set())
async def handle_book_response(ctx: Context, _sender: str, msg: BookTableResponse):
    if msg.success:
        ctx.logger.info("Table reservation was successful")
 
    else:
        ctx.logger.info("Table reservation was UNSUCCESSFUL")
 
    ctx.storage.set("completed", True)
 
if __name__ == "__main__":
    user.run()