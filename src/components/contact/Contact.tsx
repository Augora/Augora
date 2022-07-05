import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import TextField from '@mui/material/TextField'

function Contact() {
  const form = useRef()

  const sendEmail = (e) => {
    e.preventDefault()
    
    if (e.target.from_name.value) {
      console.log('honey pot')
      return
    } else {
      console.log('valid mail')
      emailjs.sendForm('service_fua01f1', 'template_e7atykl', form.current, 'pWmj5Q30UXVFZ-C6n')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        })
    }

  }

  return (
    <form ref={form} id="contact-form" onSubmit={sendEmail}>
      <input type="text" id="contact__name" name="from_name"/>
      <TextField
        id="contact__firstname"
        label="Prénom"
        variant="standard"
        name="from_firstname"
      />
      <TextField
        id="contact__lastname"
        label="Nom de famille"
        variant="standard"
        name="from_lastname"
      />
      <TextField
        id="contact__email"
        label="E-mail"
        variant="standard"
        name="from_email"
        required
      />
      <TextField
        id="contact__message"
        label="Votre message"
        variant="standard"
        name="from_message"
        multiline
        required
        rows={5}
      />
      <input type="submit" value="Envoyer" />
    </form>
  )
}

export default Contact