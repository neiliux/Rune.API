## A restful API for MTG card collectors and deck builders

### Hitting Endpoints

The only things you can hit without a jwt are /auth and creating a new user. If
you are sending data, you must set the `Content-Type` header.

```
GET /collections/sam
Authentication: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhbSIsImlhdCI6MTQ1NzkyMzE4MywiZXhwIjoxNDU3OTI5MTgzfQ.1OpxoDv7yeqxxOCslGi-l2I_ZBYgq34Vrq-eDeG_z-I
```

### Sets

Get all sets

```
GET /sets
Authorization: Bearer ...
```

Get a specific set, including all cards in the set. To find the ID of a
specific set, use the `code` field from the sets browse endpoint, e.g.
ODY for Odyssey

```
GET /sets/:id
Authorization: Bearer ...
```

### Cards

Gets a specific card. If a set parameter is provided, data relevant to that
printing (e.g. the artist) will be returned in addition to the standard info.

```
GET /cards/:name
Authorization: Bearer ...
```

```
GET /cards/:name?set=:set
Authorization: Bearer ...
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

Get a collection

```
GET /collections/sam/super_collection
Authentication: Bearer ...
```

Create a collection

```
POST /collections
Authentication: Bearer ...
Content-Type: application/json
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
Content-Type: application/json
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
