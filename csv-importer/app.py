import os
import csv
from flask import Flask, render_template, request, jsonify
from flask_dropzone import Dropzone
import subprocess

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, template_folder=basedir)

app.config.update(
    UPLOADED_PATH=os.path.join(basedir, 'uploads'),
    DROPZONE_MAX_FILE_SIZE=1024,
    DROPZONE_TIMEOUT=5 * 60 * 1000
)

uploads_dir = app.config['UPLOADED_PATH']
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

dropzone = Dropzone(app)
API_KEY = ""

@app.route('/', methods=['POST', 'GET'])
def upload():
    if request.method == 'POST':
        f = request.files.get('file')
        uploaded_csv_path = os.path.join(app.config['UPLOADED_PATH'], 'upload.csv')
        f.save(uploaded_csv_path)

        # Display all column names
        with open(uploaded_csv_path, 'r') as csv_file:
            csv_reader = csv.reader(csv_file)
            header = next(csv_reader)
            columns = [header.index(column_name) for column_name in header]

        return render_template('index.html', columns=columns, uploaded_csv='upload.csv')

    return render_template('index.html', columns=None, uploaded_csv=None)

@app.route('/export', methods=['POST'])
def export():
    # Receive the selectedColumnName from the AJAX request
    data = request.get_json()
    selected_column_name = data.get('selectedColumnName')

    # Add your code here to store or export the selected column data
    # For example, you can print the selected column name in the server log
    print('Received selectedColumnName:', selected_column_name)

    try:
        # Execute filter.py with the selected_column_name as an argument
        subprocess.run(['python3', 'filter.py', selected_column_name])

        # You can also return a response to the client if needed
        return jsonify({'message': 'Exporting column: ' + selected_column_name})
    except Exception as e:
        print("Error running filter.py:", str(e))
        return jsonify({'error': 'An error occurred while running filter.py'})

if __name__ == '__main__':
    app.run(debug=True)

