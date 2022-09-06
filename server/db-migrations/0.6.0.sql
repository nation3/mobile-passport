delete from registrations;
alter table registrations add column push_token text not null;
