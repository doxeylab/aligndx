import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bs4 import BeautifulSoup as bs
import os 

def email_html_customizer(sample):
  with open('email_template.html', 'r') as f:
    html = f.read()
  soup = bs(html, 'html.parser')
  old_text = soup.find("h1", {"id":"greeting"})
  old_text.string = (f'Your results for sample {sample} are ready!')
  return soup


def send_email(receiver_email, sample):
    sender_email = "aligndx.notifications@gmail.com" 
    password = "EntrezGene"

    message = MIMEMultipart("alternative")
    message["Subject"] = f"Analysis Results for {sample}"
    message["From"] = sender_email
    message["To"] = receiver_email
  
    html = email_html_customizer(sample) 
 
    html_part = MIMEText(html, "html")
    message.attach(html_part) 

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )