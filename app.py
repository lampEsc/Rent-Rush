from flask import Flask, render_template, redirect, request, url_for, session, g
from flask_session import Session
from functools import wraps
from forms import LoginForm, RegistrationForm, SortMain, Search
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, close_db
from datetime import date

app = Flask(__name__)

app.config['SECRET_KEY'] = "Though-my-minds-at-peace-the-world-out-of-order"
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.teardown_appcontext
def close_db_at_end_of_request(e=None):
    close_db(e)

@app.before_request
def load_logged_in_user():
    g.user = session.get('user_id', None)

def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('user'))
        return view(**kwargs)
    return wrapped_view

@app.route('/', methods=['GET', 'POST'])
def welcome():
    return render_template('home.html', title='Welcome!')


@app.route('/game', methods=['GET', 'POST'])
def game():
    return render_template('game.html', title='Game')

@app.route('/leaderboard', methods=['GET', 'POST'])
@login_required
def leaderboard():
    db = get_db()

    users = db.execute(''' SELECT * FROM users;''').fetchall()

    return render_template('leaderboard.html', title='Leaderboards', caption='Users', users=users)


@app.route('/registration_login', methods=['GET', 'POST'])
def user():
    lform = LoginForm()
    rform = RegistrationForm()
    response=''
    session['admin'] = False

    if lform.validate_on_submit():
        user_id = lform.user_id.data
        password = lform.password1.data
        if user_id == 'lamp' and password == 'reallysafepassword_121212':
            session['admin'] = True
            return redirect(url_for('home'))
        
        db = get_db()
        user = db.execute('''SELECT * FROM users
                            WHERE name = ?;''', (user_id,)).fetchone()

        if user is None:
            lform.user_id.errors.append('Please make sure your User ID is spelled correctly.')
        elif not check_password_hash(user['password'], password):
            lform.password1.errors.append('Incorrect password!')
        else:
            session.clear()
            session['user_id'] = user_id

            return redirect(url_for('welcome'))

    if rform.validate_on_submit():
        user_id = rform.user_id.data
        password = rform.password1.data
        password2 = rform.password2.data
        db = get_db()

        if db.execute('''SELECT * FROM users
            WHERE name = ?;''', (user_id,)).fetchone() is not None:
            rform.user_id.errors.append('User id already taken!')
        else:
            db.execute('''INSERT INTO users (name, password)
                            VALUES (?, ?)''', (user_id, generate_password_hash(password)))
            db.commit()
            response='Registration Successful'

    return render_template('user.html', lform=lform, rform=rform, title='Rent Rush / Login', response=response)

@app.route('/store_score', methods=['GET', 'POST'])
def store_score():
    if request.method == 'POST':
        if g.user is not None:
            db = get_db()
            currentscoins = 0
            currentscore = 0
            user = session['user_id']
            userdata = {}
            score = int(request.form['level']) 
            coins = int(request.form['coins'])
            datenow = date.today().strftime('%Y-%m-%d %H:%M:%S')
            datenow = datenow.split(' ')
            datenow = str(datenow[0])

            userdata = db.execute(''' SELECT * FROM users WHERE name = ?;''', (user,)).fetchone()
            
            if userdata['score'] is None:
                currentscore = 0
            else:
                currentscore = userdata['score']
            if userdata['coins'] is None:
                currentcoins = 0
            else:
                currentcoins = userdata['coins']

            if score > currentscore or coins > currentcoins:
                db.execute(" UPDATE users SET date = ? WHERE name = ?;", (datenow, user))
                db.execute(" UPDATE users SET score = ? WHERE name = ?;", (score, user))
                db.execute(" UPDATE users SET coins = ? WHERE name = ?;", (coins, user))
                db.commit()

                return 'success'
            else:
                return 'toobad'
        else:
            return 'login'
    else:
        return redirect(url_for('user'))
    

@app.route('/logout')
@login_required
def logout():
    session.clear()

    return redirect(url_for('welcome'))

