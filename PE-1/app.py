from flask import Flask, render_template, request, Response, jsonify


app = Flask(__name__)


@app.route('/')
def index():
    """Serve the main chat interface"""
    return render_template('index.html')

@app.route('/view')
def view():
    return render_template('view.html')


if __name__ == '__main__':
    app.run(debug=True)
