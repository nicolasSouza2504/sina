SELECT 'CREATE DATABASE sesi_senai WITH ENCODING ''UTF8'' TEMPLATE template0'
WHERE NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = 'sesi_senai'
)\gexec
