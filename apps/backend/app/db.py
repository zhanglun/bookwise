from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


def create_db(config):
  if 'URI' in config:
    # Create a new client and connect to the server
    client = MongoClient(config['URI'], server_api=ServerApi('1'))
    print(client)

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)
  # else:
  #   raise Exception("MongoDB not found!")
