import React, { useRef } from "react"
import emailjs from "@emailjs/browser"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

function Contact() {
  const form = useRef()

  const sendEmail = (e) => {
    e.preventDefault()

    if (e.target.from_name.value) {
      return
    } else {
      emailjs.sendForm("service_fua01f1", "template_e7atykl", form.current, "pWmj5Q30UXVFZ-C6n").then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
    }
  }

  return (
    <div className="contact__content">
      <p className="contact__text">
        Si vous souhaitez nous contacter, merci de remplir ce formulaire.
        <br />
        <span className="bigtext">
          <span>&#9888;</span> Ce formulaire ne sert pas à contacter directement un député
        </span>
      </p>
      <form ref={form} id="contact-form" onSubmit={sendEmail}>
        <input type="text" id="contact__name" name="from_name" />
        <TextField id="contact__firstname" label="Prénom" variant="standard" name="from_firstname" />
        <TextField id="contact__lastname" label="Nom" variant="standard" name="from_lastname" />
        <TextField id="contact__email" label="E-mail" variant="standard" name="from_email" required />
        <TextField
          id="contact__message"
          label="Votre message"
          variant="standard"
          name="from_message"
          multiline
          required
          rows={5}
        />
        <Button variant="outlined" type="submit" size="large">
          Envoyer
        </Button>
      </form>
    </div>
  )
}

export default Contact
