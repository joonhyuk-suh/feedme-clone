-- A saved article is a snapshot of one conversion result in the owner's account.
-- One row per (owner, source URL); saving the same URL again overwrites it.
create table public.saved_articles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  url text not null,
  title text not null,
  author text not null default '',
  markdown text not null,
  saved_at timestamptz not null default now(),

  primary key (id),
  unique (user_id, url)
);

-- The list shows the owner's articles, newest save first.
create index saved_articles_user_id_saved_at_idx
  on public.saved_articles (user_id, saved_at desc);

-- Owner-only access, the same way as public.profiles.
revoke all on public.saved_articles from anon, authenticated;
grant select, insert, update, delete on public.saved_articles to authenticated;
grant all on public.saved_articles to service_role;

alter table public.saved_articles enable row level security;

create policy "Users can view their own saved articles"
  on public.saved_articles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can save their own articles"
  on public.saved_articles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can overwrite their own saved articles"
  on public.saved_articles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own saved articles"
  on public.saved_articles for delete
  to authenticated
  using ((select auth.uid()) = user_id);
