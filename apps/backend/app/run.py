from flask import Flask, request
app = Flask(__name__)

@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.route("/upload", methods=["POST"])
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
