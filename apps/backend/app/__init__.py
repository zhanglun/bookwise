import os
import tomllib
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
print(basedir)

def register_logging(app):
  app.logger.setLevel(logging.INFO)

  log_path = os.path.join(basedir, 'logs')

  if not os.path.exists(log_path):
      os.makedirs(log_path)

  formatter = logging.Formatter('%(asctime)s - %(name)s - %(module)s - %(levelname)s - %(message)s')

  file_handler = RotatingFileHandler(os.path.join(log_path, 'app.log'),
                                      maxBytes=10 * 1024 * 1024, backupCount=10)
  file_handler.setFormatter(formatter)
  file_handler.setLevel(logging.INFO)

  if not app.debug:
    app.logger.addHandler(file_handler)

def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)
  app.config.from_file("config.dev.toml", load=tomllib.load, text=False)

  try:
      os.makedirs(app.instance_path)
  except OSError:
      pass

  from app.blueprint.book import book_bp

  app.register_blueprint(book_bp)

  register_logging(app)

  app.logger.info("this is logger")


  return app
