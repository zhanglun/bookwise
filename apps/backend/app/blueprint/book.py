from flask import Blueprint, request

book_bp = Blueprint("book", __name__, url_prefix="/books")

@book_bp.route("/upload", methods=["POST"])
def upload_file():
  if request.method == 'POST':
    print("f{}", request.form)
    print("{}", request.files)

    if 'files' not in request.files:
      return "ok"

    files = request.files.getlist('files')

    for file in files:
      print(file.filename)

    return 'okk3'
