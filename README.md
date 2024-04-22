# pixal-react
This combines the work from the repos [Pixalate](https://github.com/bmontambault/pixalate) and [Predicate Explorer](https://github.com/bmontambault/predicate_vis).

It runs a React frontend and Flask backend.

Referenced this for setting up: [Dev Article](https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i)

## React frontend

### Getting started:

Dev Server:

`cd frontend`
`npm run start`

You can start the backend from the frontend folder:

`cd frontend`
`npm run start-backend`
`"http://localhost:3000"`

## Flask backend

There is a proxy in frontend/package.json for path for Flask server `"http://localhost:5000"`.
This means we can use relative paths to hit flask endpoints. (`"/profile"` instead of `"http://localhost:5000/profile"`).

We are using axios.js for making async requests on the frontend.

### Getting started:
`cd backend`
`source env/bin/activate`
`run flask` or? `env/bin/flask run`
`"http://localhost:5000"`

`pip install -r requirements.txt`

NOTES FOR VENV CHANGE:
# Save current installs
(venv) -> pip freeze -r > requirements.txt

# Shutdown current env
(venv) -> deactivate

# Copy it to keep a backup
-> mv venv venv-3.8

# Ensure you have python3.7
-> python3.7 -V

# Create and activate a 3.7 venv
-> python3 -m venv venv-3
-> source venv-3/bin/activate

# Reinstall previous requirements
(venv-3) -> pip install -r requirements.txt