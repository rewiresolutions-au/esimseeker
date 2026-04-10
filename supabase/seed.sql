insert into countries (name, iso_code, region) values
('Japan','JP','asia'),
('Thailand','TH','asia'),
('Indonesia','ID','asia'),
('United Kingdom','GB','europe'),
('France','FR','europe'),
('Italy','IT','europe'),
('United States','US','americas'),
('Canada','CA','americas'),
('Mexico','MX','americas'),
('United Arab Emirates','AE','middle-east'),
('South Africa','ZA','africa'),
('Australia','AU','oceania'),
('New Zealand','NZ','oceania')
on conflict (iso_code) do nothing;

insert into providers (name, affiliate_base_url) values
('Airalo', 'https://www.airalo.com/'),
('Holafly', 'https://esim.holafly.com/'),
('Nomad', 'https://www.getnomad.app/'),
('eSIM Go', 'https://www.esimgo.com/')
on conflict (name) do nothing;
