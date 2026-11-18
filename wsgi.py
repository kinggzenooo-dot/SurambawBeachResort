from app import app, init_db

init_db()
application = app

if __name__ == "__main__":
    app.run()
