delete from registrations;
alter table registrations add column template_version int not null;
