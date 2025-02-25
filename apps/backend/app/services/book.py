import os
import app.utils.epub_parser as epub_parser

def get_lib_path():
  home = os.path.expanduser("~")
  lib_path = os.path.join(home, "Documents", "BookWise")

  if not os.path.exists(lib_path):
    os.makedirs(lib_path)

  return lib_path

def save_files(files):
  dest = get_lib_path()
  print(dest)

  for file in files:
    print("file {}", file)
    print("===> {}", os.path.join(dest, file.filename))
    try:
      mimetype = file.content_type
      book_folder = os.path.join(dest, file.filename.rsplit(".", 1)[0])

      if not os.path.exists(book_folder):
        os.makedirs(book_folder)

      book_final_path = os.path.join(book_folder, file.filename)
      file.save(book_final_path)
      epub_parser.parse_epub(book_final_path)
    except Exception as e:
      raise e


def create_model(data):
  pass


def parse_cover(cover_path, file_buffer, type):
  pass
