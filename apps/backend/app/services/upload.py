import os

def get_lib_path():
  home = os.path.expanduser("~")
  return os.path.join(home, "Document", "BookWise Library")

def save_file(file):
  dest = get_lib_path()
  file.save(os.path.join(dest, file.filename))
