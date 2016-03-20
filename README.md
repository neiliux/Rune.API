## A restful API for MTG card collectors and deck builders

### Hitting Endpoints

The only things you can hit without a jwt are /auth and creating a new user.

```
GET /collections/sam
Authentication: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhbSIsImlhdCI6MTQ1NzkyMzE4MywiZXhwIjoxNDU3OTI5MTgzfQ.1OpxoDv7yeqxxOCslGi-l2I_ZBYgq34Vrq-eDeG_z-I
```

### Users

```
POST /users
Content-Type: application/json
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

### Collections

Create a collection

```
POST /collections
Authentication: Bearer ...
{
  "name": "super_collection",
  "description": "My super collection"
}
```

Use a `PATCH` request to perform a partial update for a collection. The set
name for each card is optional. If the quantity is 0, the card will be removed
from the collection.

```
PATCH /collections/sam/super_collection
Authentication: Bearer ...
{
  "cards": [
    {
      "name": "Abandoned Outpost",
      "set": "ODY",
      "quantity": 3
    },
    {
      "name": "Naturalize",
      "quantity": 1
    }
  ]
}
```
