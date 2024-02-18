from uagents import Context, Model, Protocol
from query import TableStatus
from typing import List
 
class ShopRequest(Model):
    items: List[str]
    quantities: List[int]
 
class ShopResponse(Model):
    cost: int
    items: List[str]
    quantities: List[int]
 
shop_proto = Protocol()
@shop_proto.on_message(model=ShopRequest, replies=ShopResponse)
async def handle_shop_request(ctx: Context, sender: str, msg: ShopRequest):
    items_to_buy = msg.items
    quants_to_buy = msg.quantities

    stock = {
        item: (quantity, price)
        for (
            item,
            quantity,
            price
        ) in ctx.storage.items()
    }

    tot_price = 0
    bought_items = []
    bought_quants = []
    for i in range(len(items_to_buy)):
        if items_to_buy[i] in stock:
            num_to_buy = min(stock[items_to_buy[i]][0], quants_to_buy[i])
            if num_to_buy > 0:
                bought_items.append(items_to_buy[i])
                bought_quants.append(num_to_buy)
            
            ctx.storage.set(items_to_buy[i], stock[items_to_buy[i]][0] - num_to_buy)
            tot_price += num_to_buy * stock[items_to_buy[i]][1]

    await ctx.send(sender, ShopResponse(cost=tot_price, items=bought_items, quants=bought_quants))