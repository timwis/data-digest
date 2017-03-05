# Roadmap / brainstorming

## v1
Let's assume the API being subscribed to allows you to fetch records that have
been created on-or-after a certain date/time, ie.

```
https://phl.carto.com/api/v2/sql?q=SELECT * FROM crime_incidents WHERE datetime
>= CURRENT_DATE()
```

This service would require the following database schema

| id | query               | email | template |
|----|---------------------|-------|----------|
| 1  | SELECT * FROM CR... | x@x.x | ...      |

A later version might normalize the queries and templates for efficiency. The
`frequency` value would be part of the job schedule. In fact, perhaps if these
are just AWS Lambda functions, we don't even need a database -- they're all just
part of the Lambda function's configuration / environment variables. The
template may be too long to fit in an environment variable though.

## v2
How do we support APIs that don't let you filter by record creation date?

### Option A

#### queries
| id | query               |
|----|---------------------|
| 3  | status=active       |

#### subscribers
| id | email | query | frequency |
|----|-------|-------|-----------|
| 1  | x@x.x | 3     | daily     |

#### query-matches
| query-id | record-id |
|----------|-----------|
| 3        | 124098    |

Although this wouldn't work if subscribers have different frequencies...
Maybe MVP requires all queries be daily?
Perhaps we can flush the query-matches cache each run and only fill it
with the record-ids of the most recent query.

### Option B

#### records-observed
| id | date-observed |
|----|---------------|
| 22 | 2016-10-12:32 |

#### queries
| id | query         | last-ran   |
|----|---------------|------------|
| 3  | status=active | 2016-12:23 |

#### Query

```sql
SELECT id
FROM records-observed
WHERE date-observed < ${query.last-ran}
```
