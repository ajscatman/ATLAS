# ATLAS
 final project

inits:
django-admin startproject admin
python manage.py startapp finalproject

term. 1 frontend start:
term. 2 backend start:

atlas folder is backend
finalproject folder is backend/frontend
frontend/src is frontend










history:
1. setup django and rest frameworks
2. configured authentication classes in settings.py
3. created serailizer.py for user registration. (this is part of DRF to convert data types such as querys into python datatypes for JSON, XML etc.)
4. created views.py, login and registration views are setup such that the data is validated via JWT tokens
5. set registration and login views
6. setup react project: npx-create-app frontend
7. installed axios dependancy: npm install axios react-router-dom