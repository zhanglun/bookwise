import os

def get_lib_path():
  home = os.path.expanduser("~")
  return os.path.join(home, "Document", "BookWise Library")

def save_files(files):
  print(files)
  dest = get_lib_path()
  print(dest)

  for file in files:
    file.save(os.path.join(dest, file.filename))
