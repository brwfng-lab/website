INSERT INTO books (id, title, author, cover_image_url, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'The Great Gatsby', 'F. Scott Fitzgerald', 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg', 'past'),
  ('22222222-2222-2222-2222-222222222222', '1984', 'George Orwell', 'https://m.media-amazon.com/images/I/61NAx5pd6XL._AC_UF1000,1000_QL80_.jpg', 'current'),
  ('33333333-3333-3333-3333-333333333333', 'Dune', 'Frank Herbert', 'https://m.media-amazon.com/images/I/A1u+2ZYG3uL._AC_UF1000,1000_QL80_.jpg', 'nominated');

INSERT INTO events (id, title, description, date_time, book_id) VALUES
  ('44444444-4444-4444-4444-444444444444', '1984 Discussion Meeting', 'Join us for a discussion of 1984 by George Orwell.', NOW() + INTERVAL '7 days', '22222222-2222-2222-2222-222222222222');

INSERT INTO discussions (id, book_id, title, content) VALUES
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Part 1 Impressions', 'What did you think of the first part of the book? Was Winston''s reaction justified?');
