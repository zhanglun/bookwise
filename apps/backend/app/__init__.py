import os
import tomllib
from flask import Flask

def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)
  app.config.from_file("config.dev.toml", load=tomllib.load, text=False)

  try:
      os.makedirs(app.instance_path)
  except OSError:
      pass

  from app.blueprint.book import book_bp
  app.register_blueprint(book_bp)

  return app
