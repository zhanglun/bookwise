from flask import Flask, request
import app.config as config
import app.db as db
from app.blueprint.book import book_bp

app = Flask(__name__)
app.config.from_object(config)

print(app.config['URI'])

db_instance = db.create_db(app.config)

app.register_blueprint(book_bp)
