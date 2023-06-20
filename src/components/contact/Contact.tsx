import React, { useRef, useState } from "react"
import emailjs from "@emailjs/browser"
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material"
import Link from "next/link"

function Contact() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string>(null)
  const [loading, setLoading] = useState(false)
  const form = useRef<HTMLFormElement>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement

    const honeypot = target.querySelector<HTMLInputElement>("#contact__name")
    if (honeypot?.value.length !== 0) return

    setLoading(true)

    emailjs.sendForm("service_fua01f1", "template_e7atykl", form.current, "pWmj5Q30UXVFZ-C6n").then(
      (result) => {
        console.log(result.text)
        setSuccess(true)
        setLoading(false)
      },
      (error) => {
        console.log(error.text)
        setError(error.text)
        setLoading(false)
      }
    )
  }

  return (
    <div className="contact__content">
      {!success ? (
        <>
          <div className="contact__text">
            <span className="bigtext">
              <span>&#9888;</span>
              <br />
              <br />
              Ce formulaire ne permet pas de contacter un député directement.
            </span>
            <div>Pour ce faire, utilisez l'icône mail de la page d'un député.</div>
          </div>
          <form ref={form} id="contact-form" onSubmit={handleSubmit}>
            <input type="text" id="contact__name" name="from_name" />
            <TextField id="contact__firstname" label="Prénom" name="from_firstname" size="small" />
            <TextField id="contact__lastname" label="Nom" name="from_lastname" size="small" />
            <TextField id="contact__email" label="E-mail" name="from_email" required size="small" />
            <TextField
              id="contact__message"
              label="Votre message"
              name="from_message"
              multiline
              required
              rows={10}
              size="small"
            />
            <FormControlLabel control={<Checkbox required />} label="Je souhaite contacter Augora et non pas un député" />
            <FormControlLabel
              control={<Checkbox required />}
              label={
                <div>
                  J’autorise ce site à conserver mes données transmises via ce formulaire.&nbsp;
                  <Link
                    className="link"
                    href={{
                      pathname: "/mention-legales",
                      hash: "cgu-formulaire-contact",
                    }}
                    target="_blank"
                  >
                    Voir notre paragraphe sur le formulaire de contact de nos mentions légales
                  </Link>
                </div>
              }
            />
            <Button variant="outlined" type="submit" size="large" disabled={loading}>
              Envoyer
            </Button>
            <div className="contact__error">{error && `Erreur lors de l'envoi du message : ${error}`}</div>
          </form>
        </>
      ) : (
        <h2>Message envoyé! Vous pouvez fermer cette fenêtre.</h2>
      )}
    </div>
  )
}

export default Contact
