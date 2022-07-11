## Description

A sample Typescript app that ingests and returns smoothie-related data.

## Deployment information

The app is dockerized and hosted on a single EC2 t2.micro instance. 
It connects to a free-tier Postgres RDS database.
The DNS registration is handled by Hover.

## Communicating with the app

The public url for the app is at `walkingfood.site`, and the app is exposed on port `3000`. 
There are 4 endpoints available in the app:
* `GET /smoothie/all`
* `POST /smoothie`
* `PUT /smoothie/{id}`
* `DELETE /smoothie/{id}`

Each endpoint expects a `user-uuid` header with a unique-per-user string - this differentiates callers
in lieu of a real authentication scheme.

### Data expectations
Each smoothie must contain a name and a list of ingredients.
Each ingredient must contain a name, a quantity, and a unit of measure.

### Units of measure for ingredients
The units of measure are enums. The options for the enum are as follows:
* `CUP`
* `OZ`
* `GRAM`
* `LB`
* `GALLON`

### The Update Call
The update call will only attempt to replace data that is passed to it; 
if you omit a field, that will indicate that the data should not be changed. 
Ingredients can be altered by specifying an id and altering the fields;
they can be added by not specifying an id and specifying all 3 required ingredient fields;
they can be deleted by specifying an id and setting `"delete": true`.

## Example calls

```bash
$ curl --location --request GET 'walkingfood.site:3000/smoothie/all' \
--header 'user-uuid: BlahBlah'
```

```bash
$ curl --location --request POST 'walkingfood.site:3000/smoothie' \
--header 'user-uuid: BlahBlah' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "First Smoothie!",
    "ingredients": [
        {
            "name": "Milk",
            "quantity": 4,
            "unit": "CUP"
        },
        {
            "name": "Frozen Strawberries",
            "quantity": 1,
            "unit": "LB"
        },
        {
            "name": "Frozen Bananas",
            "quantity": 1,
            "unit": "LB"
        },
        {
            "name": "Peanut Butter",
            "quantity": 1,
            "unit": "CUP"
        }
    ]
}' 
```

```bash
$ curl --location --request PUT 'walkingfood.site:3000/smoothie/1' \
--header 'user-uuid: BlahBlah' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Better Smoothie!",
    "ingredients": [
        {
            "id": 1,
            "name": "Cold Milk"
        },
        {
            "id": 2,
            "quantity": 1000,
            "unit": "GRAM"
        },
        {
            "name": "Frozen Blueberries",
            "quantity": 1,
            "unit": "CUP"
        },
        {
            "id": 4,
            "delete": true
        }
    ]
}'
```

```bash
$ curl --location --request DELETE 'walkingfood.site:3000/smoothie/1' \
--header 'user-uuid: BlahBlah'
```