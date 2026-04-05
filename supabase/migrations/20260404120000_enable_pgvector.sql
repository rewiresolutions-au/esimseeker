-- pgvector for plan semantic search (embeddings).
-- Run before tables that reference type vector.
create extension if not exists vector with schema extensions;
