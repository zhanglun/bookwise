import { useEffect, useState } from 'react';
import { makeBook } from 'foliate-js/view.js';

export const Foliate = () => {
  const [books, setBooks] = useState({
    pdf: null,
    epub: null,
    mobi: null,
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadBooks = async () => {
      const bookFiles = {
        pdf: '/public/1.pdf',
        epub: '/public/3.epub',
        mobi: '/public/2.mobi',
      };

      const results = {};
      const errorResults = {};

      for (const [format, url] of Object.entries(bookFiles)) {
        try {
          // makeBook 可以直接接受 URL 字符串
          const book = await makeBook(url);
          console.log('🚀 ~ loadBooks ~ book?.getCover():', await book?.getCover());
          results[format] = book;
        } catch (error) {
          console.error(`Failed to load ${format}:`, error);
          errorResults[format] = error.message;
        }
      }

      setBooks(results);
      console.log('🚀 ~ loadBooks ~ results:', results);
      setErrors(errorResults);
      setLoading(false);
    };

    loadBooks();
  }, []);

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Book Parser Demo</h1>

      {/* PDF Book */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>PDF Book</h2>
        {errors.pdf ? (
          <p style={{ color: 'red' }}>Error: {errors.pdf}</p>
        ) : books.pdf ? (
          <pre>
            {JSON.stringify(
              {
                metadata: books.pdf.metadata,
                sections: books.pdf.sections?.length,
                toc: books.pdf.toc,
                rendition: books.pdf.rendition,
              },
              null,
              2
            )}
          </pre>
        ) : (
          <p>No PDF loaded</p>
        )}
      </div>

      {/* EPUB Book */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>EPUB Book</h2>
        {errors.epub ? (
          <p style={{ color: 'red' }}>Error: {errors.epub}</p>
        ) : books.epub ? (
          <pre>
            {JSON.stringify(
              {
                metadata: books.epub.metadata,
                sections: books.epub.sections?.length,
                toc: books.epub.toc,
                rendition: books.epub.rendition,
                dir: books.epub.dir,
              },
              null,
              2
            )}
          </pre>
        ) : (
          <p>No EPUB loaded</p>
        )}
      </div>

      {/* MOBI Book */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>MOBI Book</h2>
        {errors.mobi ? (
          <p style={{ color: 'red' }}>Error: {errors.mobi}</p>
        ) : books.mobi ? (
          <pre>
            {JSON.stringify(
              {
                metadata: books.mobi.metadata,
                sections: books.mobi.sections?.length,
                toc: books.mobi.toc,
                rendition: books.mobi.rendition,
              },
              null,
              2
            )}
          </pre>
        ) : (
          <p>No MOBI loaded</p>
        )}
      </div>
    </div>
  );
};
