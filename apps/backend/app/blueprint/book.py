from flask import Blueprint, request, current_app
import app.services.book as book

book_bp = Blueprint("book", __name__, url_prefix="/books")

@book_bp.route("/upload", methods=["POST"])
def upload_file():
  if request.method == 'POST':
    if 'files' not in request.files:
      return "ok"

    files = request.files.getlist('files')

    book.save_files(files)

    return 'okk3'
