# ATLAS
 final project
test local django superuser: 
aj
Johnwick123$

inits:
django-admin startproject admin
python manage.py startapp finalproject

term. 1 frontend start:
cd frontend
npm start

term. 2 backend start: 
cd atlas 
python manage.py runserver
npm start


atlas folder is backend 
finalproject folder is backend/frontend (django)
frontend/src is frontend (react)










history:
1. setup django and rest frameworks
2. configured authentication classes in settings.py
3. created serailizer.py for user registration. (this is part of DRF to convert data types such as querys into python datatypes for JSON, XML etc.)
4. created views.py, login and registration views are setup such that the data is validated via JWT tokens
5. set registration and login views
6. setup react project: npx-create-app frontend
7. installed axios dependancy: npm install axios react-router-dom
8. RegistrationForm.js component renders a form with input fields for username, email, password etc.
   > when the form is submitted, the handleSubmit function is called, sending a POST request to the backend registration API endpoint using axios
   > if successful: redirect to login page, else handle and process error
9. LoginForm.js component renders input fields for username and password
   > same as registration, if successful store receieved tokens and redirect to page
   > otherwise handle and process error
10. Configured routes in App.js (App sets up routes using React Router, /register renders registration etc.)
