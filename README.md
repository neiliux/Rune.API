## A restful API for MTG card collectors and deck builders

### Users

```
POST /users
{
  "username": "sam",
  "password": "sureDoLoveTacos",
  "email": "sam@example.com"
}
```

### Authentication

```
POST /auth
Content-Type: application/json
{
  "username": "sam",
  "password": "sureDoLoveTacos"
}
```

### Hitting Endpoints

The only things you can hit without a jwt are /auth and creating a new user.

```
GET /collections/sam
Authentication: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhbSIsImlhdCI6MTQ1NzkyMzE4MywiZXhwIjoxNDU3OTI5MTgzfQ.1OpxoDv7yeqxxOCslGi-l2I_ZBYgq34Vrq-eDeG_z-I
```
