import os

def get_lib_path():
  home = os.path.expanduser("~")
  lib_path = os.path.join(home, "Documents", "BookWise")

  if not os.path.exists(lib_path):
    os.makedirs(lib_path)

  return lib_path

def save_files(files):
  print(files)
  dest = get_lib_path()
  print(dest)

  for file in files:
    print("file {}", file)
    print("===> {}", os.path.join(dest, file.filename))
    file.save(os.path.join(dest, file.filename))
