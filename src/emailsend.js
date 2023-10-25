import React from 'react';
import emailjs from '@emailjs/browser';

export default function ContactUs() {

  function sendEmail(e) {
    e.preventDefault();

    var templateParams = {
        name: 'James',
        notes: 'Check this out!'
    };
    
    emailjs.send('service_v8xdo9g', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_USER_ID', templateParams)
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
        }, function(err) {
           console.log('FAILED...', err);
        });
  }

  return (
    <form ref={form} onSubmit={sendEmail}>
      <input type="hidden" name="contact_number" />
      <label>Name</label>
      <input type="text" name="from_name" />
      <label>Email</label>
      <input type="email" name="from_email" />
      <label>Subject</label>
      <input type="text" name="subject" />
      <label>Message</label>
      <textarea name="html_message" />
      <input type="submit" value="Send" />
    </form>
  );
}