-- Migration: drop custom reactions system
-- Run manually via Supabase SQL editor or psql.
-- Safe to run multiple times (IF EXISTS guards).

drop table if exists public.reactions;
