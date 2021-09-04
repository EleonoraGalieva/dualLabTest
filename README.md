# dualLabTest
## How to use the code
1. Install zip from this repo.
2. Install next npm modules: bcryptjs, cors, env-cmd, express, jsonwebtoken, mongoose, multer, validator.
3. Create a folder named config in the root of the app.
4. Create file dev.env in config folder and define values PORT, MONGODB_URL(url of the database on local machine), JWT_SECRET(secret for creating tokens),
    or just define those values in the code directly, skipping step 3.
5. Connect to the local mongo database and run 'npm run dev' in the terminal.
6. The requests can be tested in applications like Postman or others.
## How it works
There are several rounts to use:<br>
Used database: MongoDB<br>
1. POST /api/user <br>
This request accepts JSON data with user information like name, email, password, age and gender, creates a new user in the database and returns a created user's id to the client.<br>
Example:<br>
request:<br>
{
    "name":"Sasha",
    "password":"1234567890",
    "email":"sasha@mail.ru",
    "age":14,
    "gender":"female"
}<br>
response:<br>
"6133783f51930bb7c38c9476"
2. POST /signin <br>
This request accepts JSON data with user's name and password and returns a created token for the user.<br>
Example:<br>
request:<br>
{
    "name":"Sasha",
    "password":"1234567890"
}<br>
response:<br>
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTMzNzgzZjUxOTMwYmI3YzM4Yzk0NzYiLCJpYXQiOjE2MzA3NjM5NDIsImV4cCI6MTYzMDc2NTc0Mn0.IbDROGdYRXythKSoOuAfs1LV33Od5kuR4Ojvlzz699k
3. GET /api/user/:id<br>
This request accepts users id and returns user info. Only signed in users can make this request. So a user must provide a Authorization header with value of 'Bearer *user token*'<br>
Example:<br>
localhost:3000/api/user/6133783f51930bb7c38c9476<br>
response:<br>
{
    "_id": "6133783f51930bb7c38c9476",
    "name": "Sasha",
    "email": "sasha@mail.ru",
    "gender": "female",
    "age": 14,
    "__v": 0
}<br>
4. PATCH /api/user/:id<br>
This request accepts users id and JSON data with fields that need to be changed. Only signed in users can make this request. So a user must provide a Authorization header with value of 'Bearer *user token*'<br>
Example:<br>
request:<br>
{
    "name":"Eleonora Galieva"
}
response:<br>
{
    "_id": "6133783f51930bb7c38c9476",
    "userBeforeUpdates": {
        "_id": "6133783f51930bb7c38c9476",
        "name": "Sasha",
        "email": "sasha@mail.ru",
        "gender": "female",
        "age": 14,
        "__v": 0
    },
    "userAfterUpdate": {
        "_id": "6133783f51930bb7c38c9476",
        "name": "Eleonora Galieva",
        "email": "sasha@mail.ru",
        "gender": "female",
        "age": 14,
        "__v": 0
    }
}<br>
5. GET /api/users<br>
This request is used for filtering users. It accepts three different params: age_from, age_to, gender, mailbox and returns users, who suit those params. Only signed in users can make this request. So a user must provide a Authorization header with value of 'Bearer *user token*'<br>
The request itself can look different ways too, depending on wanted result:<br>
/api/users/?gender=female&mailbox=gmail&age_from=18&age_to=55<br>
/api/users/?gender=male&mailbox=gmailage_to=15<br>
etc<br>
Example:(some new users were created)<br>
/api/users?gender=female&age_from=18&age_to=23&mailbox=gmail<br>
response:<br>
[
    {
        "_id": "61337fc451930bb7c38c9483",
        "name": "Ela",
        "email": "ela@gmail.ru",
        "gender": "female",
        "age": 20,
        "__v": 0
    }
]<br>
/api/users?gender=male&age_from=18&mailbox=yandex<br>
response:<br>
[
    {
        "_id": "61337fd251930bb7c38c9485",
        "name": "Mike",
        "email": "mike@yandex.ru",
        "gender": "male",
        "age": 20,
        "__v": 0
    }
]<br>
6. POST /api/upload<br>
This request loads an image(only jpg) and returns status code. Only signed in users can make this request. So a user must provide a Authorization header with value of 'Bearer *user token*'<br>
AUTHORIZATION TOKEN IS UPDATED EVERY TIME A USER DOES AN API REQUEST.
