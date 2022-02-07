from flask import Flask
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, TextField, validators, BooleanField, PasswordField, SelectField
from wtforms.validators import InputRequired, NumberRange, EqualTo, Length


class LoginForm(FlaskForm):
    user_id = StringField('User ID:', validators=[InputRequired()])

    password1 = PasswordField('Password:', validators=[InputRequired()])

    submit = SubmitField('Submit')

class RegistrationForm(FlaskForm):
    user_id = StringField('User ID:', validators=[InputRequired(), Length(min=3, message='User name must be longer than 2 characters.')])

    password1 = PasswordField('Password:', validators=[InputRequired(), Length(min=4, message='Password must be longer than 3 characters.')])
    password2 = PasswordField('Confirm password:', validators=[InputRequired(), EqualTo('password1')])

    submit2 = SubmitField('Submit')

class SortMain(FlaskForm):
    order = SelectField('Order ', choices=[('year ASC', 'by Year Asc'), ('year DESC', 'by Year Dsc'), ('band ASC', 'by Band Asc'), ('band DESC', 'by Band Desc'), ('name ASC', 'by Title Asc'), ('name DESC', 'by Title Desc')], validators=[InputRequired()])

    submit = SubmitField('Submit')

class Search(FlaskForm):
    search = TextField('Search: ', validators=[InputRequired()])

    submit = SubmitField('Submit')
