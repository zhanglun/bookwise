import pymupdf

def parse_epub(file_path):
  doc = pymupdf.open(file_path)

#   for page in doc: # iterate the document pages
#     text = page.get_text().encode("utf8") # get plain text (is in UTF-8)
#     print(text.decode("utf-8"))
  print(doc.metadata)
  print(doc.get_toc())
  print(doc.chapter_page_count(1))

  text = doc[5].get_text().encode("utf8")
  print(text.decode("utf-8"))
  pass
