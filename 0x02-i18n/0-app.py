#!/usr/bin/env python3
"""Basic Babel setup"""
from flask import Flask, render_template

app = Flask(__name__)
app.url_map.strict_slashes = False


@app.route('/')
def index() -> str:
    """
    Renders the index page.

    Returns:
        str: The rendered HTML content of the index page.
    """
    return render_template('0-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
