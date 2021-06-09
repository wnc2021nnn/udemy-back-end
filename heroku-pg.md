Connection information for default credential.:
- heroku pg:credentials:url postgresql-infinite-25908 --app wnc2021be

Connection info string:
   "dbname=devgrrdbv0qrf2 host=ec2-54-224-194-214.compute-1.amazonaws.com port=5432 user=fvtczrdakehlnp password=cdbdc6f2e2b7f7adbfcd014551d68c0b69ced21f6f81057d79c503866ea439b4 sslmode=require"
Connection URL:
   postgres://fvtczrdakehlnp:cdbdc6f2e2b7f7adbfcd014551d68c0b69ced21f6f81057d79c503866ea439b4@ec2-54-224-194-214.compute-1.amazonaws.com:5432/devgrrdbv0qrf2

---

Alternatively, you can omit the ssl configuration object if you specify the PGSSLMODE config var: 
heroku config:set PGSSLMODE=no-verify.