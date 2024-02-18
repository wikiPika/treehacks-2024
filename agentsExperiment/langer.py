from shop import ShopRequest, ShopResponse

from typing import List
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
import predictionguard as pg
from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import PredictionGuard
from pinecone import Pinecone
from langchain.vectorstores import Pinecone as PineconeStore
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain.embeddings import HuggingFaceEmbeddings
import os

os.environ["PREDICTIONGUARD_TOKEN"] = "q1VuOjnffJ3NO2oFN8Q9m8vghYc84ld13jaqdF7E"
os.environ["PINECONE_API_KEY"] = 'ef98008c-ca40-44f5-b8f1-25a007767f33'





langer = Agent(
    name="langer",
    port=8000,
    seed="fudu langer",
    endpoint=["http://127.0.0.1:8000/submit"],
)
 
fund_agent_if_low(langer.wallet.address())

class GetLangRequest(Model):
    question: str

class GetLangResponse(Model):
    answer: str

qa_chain = []

@langer.on_event("startup")
async def startup(ctx: Context):
    global qa_chain

    ctx.storage.set("history", [])

    print("Hello world, Langer", ctx.address)
    loaders = [TextLoader(f"../data/data{i}.txt") for i in range(11)]
    documents = [loader.load() for loader in loaders]
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents[0])
    # print(docs[0])
    embeddings = HuggingFaceEmbeddings()

    # pgllm = PredictionGuard(model="MPT-7B-Instruct", token="q1VuOjnffJ3NO2oFN8Q9m8vghYc84ld13jaqdF7E")
    pgllm = PredictionGuard(model="Nous-Hermes-Llama2-13B", 
                            token="q1VuOjnffJ3NO2oFN8Q9m8vghYc84ld13jaqdF7E")


    pc = Pinecone(api_key="ef98008c-ca40-44f5-b8f1-25a007767f33")

    vectordb = PineconeStore.from_documents(docs, embeddings, index_name="test")

    qa_chain = ConversationalRetrievalChain.from_llm(

        pgllm,

        vectordb.as_retriever(search_kwargs={'k': 2})
        
    )

    # ctx.set("model", qa_chain)

@langer.on_query(GetLangRequest, replies=GetLangResponse)
async def handle_lang_request(ctx: Context, sender: str, msg: GetLangRequest):
    history = ctx.storage.get("history") or []
    resp = qa_chain({'question': msg.question, 'chat_history': history})
    print("RESP", resp)
    history.append((msg.question, resp['answer']))
    print("HISTORY", history)
    ctx.storage.set("history", history)
    await ctx.send(sender, GetLangResponse(answer=resp['answer']))

if __name__ == "__main__":
    langer.run()