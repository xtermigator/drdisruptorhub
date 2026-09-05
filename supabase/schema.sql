create extension if not exists "pgcrypto";

create type public.record_source as enum ('local', 'notion');
create type public.task_status as enum ('todo', 'doing', 'completed');

create table public.projects (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, description text, organization text, stage text, priority integer default 3,
  status text default 'active', next_action text, last_activity timestamptz default now(), website_url text,
  notion_url text, github_url text, research_links jsonb default '[]', partners jsonb default '[]', notes text,
  source public.record_source not null default 'local', notion_id text unique, created_at timestamptz default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  institution text not null, code text not null, name text, source public.record_source not null default 'local', notion_id text unique
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null, status public.task_status not null default 'todo', due_at timestamptz, priority integer default 3,
  course_id uuid references public.courses(id) on delete cascade, project_id uuid references public.projects(id) on delete cascade,
  assignee text, source public.record_source not null default 'local', notion_id text unique, created_at timestamptz default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null, category text not null, starts_at timestamptz not null, recurrence_rule text,
  source public.record_source not null default 'local', created_at timestamptz default now()
);

create table public.project_relationships (
  source_project_id uuid references public.projects(id) on delete cascade,
  target_project_id uuid references public.projects(id) on delete cascade,
  relationship text not null, primary key (source_project_id, target_project_id)
);

alter table public.projects enable row level security;
alter table public.courses enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.project_relationships enable row level security;

create policy "owners manage projects" on public.projects for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage courses" on public.courses for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage tasks" on public.tasks for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage events" on public.events for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners view project relationships" on public.project_relationships for select using (
  exists (select 1 from public.projects p where p.id = source_project_id and p.owner_id = auth.uid())
);
