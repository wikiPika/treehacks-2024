from typing import List
from gensim.models import Word2Vec
from annoy import AnnoyIndex
import gensim

word2vec_model = gensim.downloader.load('glove-twitter-25')

# Load pre-trained Word2Vec model
# word2vec_model = Word2Vec.load('glove-twitter-50')

# Number of dimensions in the Word2Vec embeddings
embedding_dim = word2vec_model.vector_size

# Build Annoy index
annoy_index = AnnoyIndex(embedding_dim, 'angular')  # 'angular' distance is used for cosine similarity

 
from uagents import Context, Model, Protocol
 
class QueryFoodRequest(Model):
    items: List[str]
 
class QueryFoodResponse(Model):
    items: List[str]
    quantities: List[int]
    prices: List[int]

def find_closest_item(query_item):
    query_embedding = word2vec_model.wv[query_item]
    item_index = annoy_index.get_nns_by_vector(query_embedding, 1)[0]
    return item_index

query_proto = Protocol()
 
@query_proto.on_message(model=QueryFoodRequest, replies=QueryFoodResponse)
async def handle_query_request(ctx: Context, sender: str, msg: QueryFoodRequest):
    items_to_query = msg.items

    stock = {
        item: item_data
        for (
            item,
            item_data,
        ) in ctx.storage.items()
    }

    stock_items = []
    for item in stock:
        stock_items.append(item)
        embedding = stock[item][2]
        annoy_index.add_item(item, embedding)
    
    annoy_index.build(n_trees=100)  # Adjust n_trees for trade-off between accuracy and speed

    items_response = []
    quants_response = []
    prices_response = []
    for item in items_to_query:
        query_embedding = word2vec_model.wv[item]
        out_index = annoy_index.get_nns_by_vector(query_embedding, 1)[0]
        item_response = stock_items[out_index]
        items_response.append(item_response)
        quants_response.append(stock[item_response][0])
        prices_response.append(stock[item_response][1])
    

    await ctx.send(sender, QueryFoodResponse(items=items_response, quantities=quants_response, prices=prices_response))
 