-- Demo data. Times are relative to when this runs; `make db-reset` reseeds.

insert into contributor (id, name, expertise)
values (1, 'Alice Morgan', 'FINANCE'),
       (2, 'Ben Okafor', 'HEALTHCARE'),
       (3, 'Chen Wei', 'OPERATIONS'),
       (4, 'Dana Ruiz', 'HEALTHCARE'),
       (5, 'Eve Larsen', 'FINANCE'),
       (6, 'Farid Haddad', 'DATA_ANALYSIS');
-- Nobody has LEGAL, so routing a LEGAL task finds no match.

insert into task (id, title, expertise, priority, state, assignee_id, demo_never_routes, created_at, routing_started_at)
values (1, 'Quarterly budget review', 'FINANCE', 'MEDIUM', 'DONE', 1, false, now() - interval '3 hours', now() - interval '3 hours'),
       (2, 'Clinical trial cost estimate', 'HEALTHCARE', 'HIGH', 'ASSIGNED', 4, false, now() - interval '140 seconds', now() - interval '140 seconds'),
       (3, 'Supply chain KPI dashboard', 'DATA_ANALYSIS', 'MEDIUM', 'ROUTING', null, false, now() - interval '8 seconds', now() - interval '8 seconds'),
       (4, 'Hospital staffing forecast', 'HEALTHCARE', 'HIGH', 'ROUTING', null, true, now() - interval '4 minutes', now() - interval '4 minutes'),
       (5, 'Claims compliance review', 'LEGAL', 'MEDIUM', 'NO_MATCH', null, false, now() - interval '20 minutes', now() - interval '20 minutes'),
       (6, 'Cash flow model refresh', 'FINANCE', 'HIGH', 'DECLINED', null, false, now() - interval '35 minutes', now() - interval '35 minutes'),
       (7, 'Warehouse process audit', 'OPERATIONS', 'MEDIUM', 'FAILED', null, false, now() - interval '90 minutes', now() - interval '90 minutes');

insert into task_event (task_id, at, actor, state, message)
values (1, now() - interval '3 hours', 'Operator', 'ROUTING', 'Created and submitted for routing'),
       (1, now() - interval '179 minutes', 'System', 'ASSIGNED', 'Routing selected Alice Morgan'),
       (1, now() - interval '170 minutes', 'Alice Morgan', 'ACCEPTED', 'Accepted'),
       (1, now() - interval '160 minutes', 'Alice Morgan', 'IN_PROGRESS', 'Started work'),
       (1, now() - interval '1 hour', 'Alice Morgan', 'DONE', 'Completed'),
       (2, now() - interval '140 seconds', 'Operator', 'ROUTING', 'Created and submitted for routing'),
       (2, now() - interval '128 seconds', 'System', 'ASSIGNED', 'Routing selected Dana Ruiz'),
       (3, now() - interval '8 seconds', 'Operator', 'ROUTING', 'Created and submitted for routing'),
       (4, now() - interval '4 minutes', 'Operator', 'ROUTING', 'Created and submitted for routing (demo: never routes)'),
       (5, now() - interval '20 minutes', 'Operator', 'ROUTING', 'Created and submitted for routing'),
       (5, now() - interval '1189 seconds', 'System', 'NO_MATCH', 'No contributor with LEGAL expertise'),
       (6, now() - interval '35 minutes', 'Operator', 'ROUTING', 'Created and submitted for routing'),
       (6, now() - interval '2094 seconds', 'System', 'ASSIGNED', 'Routing selected Eve Larsen'),
       (6, now() - interval '25 minutes', 'Eve Larsen', 'DECLINED', 'Declined: on leave this week'),
       (7, now() - interval '90 minutes', 'Operator', 'ROUTING', 'Created and submitted for routing'),
       (7, now() - interval '5382 seconds', 'System', 'ASSIGNED', 'Routing selected Chen Wei'),
       (7, now() - interval '80 minutes', 'Chen Wei', 'ACCEPTED', 'Accepted'),
       (7, now() - interval '10 minutes', 'Chen Wei', 'FAILED', 'Failed: site access not granted');

select setval(pg_get_serial_sequence('contributor', 'id'), 6);
select setval(pg_get_serial_sequence('task', 'id'), 7);
