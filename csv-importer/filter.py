import os
import sys
import csv
import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials

def get_csv_column(file_path, column_name):
    try:
        with open(file_path, 'r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            column_data = [row[column_name] for row in csv_reader]
            return column_data
    except FileNotFoundError:
        print("File not found.")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        sys.exit(1)

def write_csv_column(file_path, column_name, column_data):
    try:
        # Read the existing CSV file (if it exists)
        try:
            existing_data = pd.read_csv(file_path)
        except FileNotFoundError:
            existing_data = pd.DataFrame()
            
        if column_name in existing_data.columns:
            print(f"Column '{column_name}' already exists in '{file_path}'. Skipping.")
        else:
            new_data = pd.DataFrame({column_name: column_data})
            result_data = pd.concat([existing_data, new_data], axis=1)
            result_data.to_csv(file_path, index=False)
            print(f"Column '{column_name}' written to '{file_path}' successfully.")
    except Exception as e:
        print(f"An error occurred while writing to '{file_path}': {e}")


def append_csv_to_google_sheets(google_sheet_name, csv_file_path):
    try:
        scope = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/spreadsheets',
                 "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]

        credentials = ServiceAccountCredentials.from_json_keyfile_name('library-management-399919-58a5d672b203.json', scope)
        client = gspread.authorize(credentials)

        spreadsheet = client.open(google_sheet_name)
        worksheet = spreadsheet.get_worksheet(0)  # Assuming you want to write to the first worksheet

        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(csv_file_path)

        # Clear existing data in the worksheet
        worksheet.clear()

        # Write the entire DataFrame to Google Sheets
        worksheet.update([df.columns.values.tolist()] + df.values.tolist())

        print(f"CSV data from '{csv_file_path}' appended to Google Sheets '{google_sheet_name}' successfully.")
    except Exception as e:
        print(f"An error occurred while appending to Google Sheets: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 filter.py <selected_column_name>")
        sys.exit(1)

    selected_column_name = sys.argv[1]
    directory_path = os.path.join(os.getcwd(), 'uploads')
    selected_file = "upload.csv"

    # Check if the selected_file exists
    selected_file_path = os.path.join(directory_path, selected_file)
    if not os.path.isfile(selected_file_path):
        print(f"Selected file '{selected_file}' not found.")
        sys.exit(1)

    column_data = get_csv_column(selected_file_path, selected_column_name)

    # Print the contents of the filtered column
    print(f"Contents of Column '{selected_column_name}':")
    for item in column_data:
        print(item)

    # Create 'filtered.csv' if it doesn't exist and write the column data to it
    filtered_csv_path = os.path.join(os.getcwd(), 'filtered.csv')
    write_csv_column(filtered_csv_path, selected_column_name, column_data)

    # Append the filtered column to Google Sheets
    google_sheet_name = 'CSV-IMPORTER'
    append_csv_to_google_sheets(google_sheet_name, filtered_csv_path)

