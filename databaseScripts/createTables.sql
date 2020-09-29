-- sudo psql -h localHost -U userName -d dbName -a -f fullFilePath

-- try to save all data to hubspot. it'll be way cleaner than 2 sources of truth

BEGIN;

CREATE TABLE IF NOT EXISTS contacts ()