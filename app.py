from flask import Flask, render_template, request, send_file, redirect, url_for, make_response, after_this_request
from flask_wtf import FlaskForm
from wtforms import SubmitField
from PyPDF2 import PdfMerger
from werkzeug.utils import secure_filename
from io import BytesIO
import os
import uuid


app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'YourSecretKey'

class UploadForm(FlaskForm):
    submit = SubmitField('Merge PDFs')

@app.route('/', methods=['GET', 'POST'])
def upload_files():
    form = UploadForm()
    if form.validate_on_submit():
        files = request.files.getlist('pdf')
        merger = PdfMerger()
        for file in files:
            filename = secure_filename(file.filename)
            file.stream.seek(0)  # Seek to the start of file
            merger.append(file.stream)  # Append the file stream directly
        merged_pdf_stream = BytesIO()
        merger.write(merged_pdf_stream)
        merger.close()
        merged_pdf_stream.seek(0)  # Go back to the start of the BytesIO stream

        temp_filename = "/tmp/merged_" + uuid.uuid4().hex + ".pdf"  # Create a temporary file
        with open(temp_filename, "wb") as temp_file:
            temp_file.write(merged_pdf_stream.getbuffer())

        @after_this_request
        def remove_file(response):
            try:
                os.remove(temp_filename)
            except Exception as error:
                app.logger.error("Error removing file: %s", error)
            return response

        response = make_response(send_file(temp_filename, mimetype='application/pdf', as_attachment=True))
        response.headers['Content-Disposition'] = 'attachment; filename=merged.pdf'
        return response

    return render_template('index.html', form=form)

if __name__ == '__main__':
    app.run(debug=True)