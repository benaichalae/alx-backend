#!/usr/bin/env python3
"""Basic Babel setup"""
from flask import Flask, render_template, g, request, session
from flask_babel import Babel, gettext


app = Flask(__name__)
app.url_map.strict_slashes = False
app.config.from_object(Config)

babel = Babel(app, default_locale='en', default_timezone='UTC')


@app.before_request
def before_request():
    if get_locale() not in Config.LANGUAGES:
        g.locale = 'en'
    else:
        g.locale = get_locale()


@app.route('/')
def index() -> str:
    home_title = gettext('home_title')
    home_header = gettext('home_header')
    return render_template('3-index.html',
                           home_title=home_title,
                           home_header=home_header)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
