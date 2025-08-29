import { useState } from "react"
 
import SettingsLayout from "../../../layout/SettingsLayout"
import PdfCreator from "./partials/PdfCreator"
import { DocusealForm } from '@docuseal/react'
 
export default function SignDocumentPage() {
 

  return (
    <SettingsLayout>

<DocusealForm
        src="https://docuseal.com/d/LEVGR9rhZYf86M"
        email="mahtabnadeem1994+test@gmail.com"
        onComplete={(data) => console.log(data)}
      />

            </SettingsLayout>
  )
}
