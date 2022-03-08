import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bs4 import BeautifulSoup as bs
from app.config.settings import get_settings
import os 

# config
app_settings = get_settings()
settings = app_settings.NotificationSettings()

baseURL = settings.base_url
sender_email = settings.sender_email   
password =  settings.password

def email_html_customizer(sample, link):
  '''
  link must be of the format "/result?submission=fileid"
  '''
  dir = os.path.dirname(os.path.abspath(__file__))
  path = os.path.join(dir, 'email_template.html') 
  with open(path, 'r') as f:
    html = f.read()
  soup = bs(html, 'html.parser')
  old_text = soup.find("h1", {"id":"greeting"})
  old_text.string = (f'Your results for sample {sample} are ready!\nClick the following to be redirected: {link}')
  return soup


def send_email(receiver_email, sample, link):

    message = MIMEMultipart("alternative")
    message["Subject"] = f"Analysis Results for {sample}"
    message["From"] = sender_email
    message["To"] = receiver_email

    url = baseURL + link 

    html = email_html_customizer(sample, url) 

    # Fool gmail by sending html as plain and html, to prevent spam flagging
    plain_part = MIMEText(html, "plain")
    html_part = MIMEText(html, "html")
    message.attach(plain_part) 
    message.attach(html_part) 

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )