from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

UPLOADS_DIR = 'uploads'

app = Flask(__name__)
CORS(app)  # Add CORS support

@app.route('/submit_data', methods=['POST'])
def submit_data():
    # Get the form data
    name = request.form['name']
    age = request.form['age']

    # Handle file upload
    files = request.files.getlist('file')  # Get all files with the key 'file'

    for file in files:
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOADS_DIR, filename))  # Save each file to the 'uploads' directory

    # Process the data (e.g., store in a database, send an email)
    # ...

    # Return a JSON response
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)