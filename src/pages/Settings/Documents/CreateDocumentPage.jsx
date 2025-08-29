import { useState } from "react"
 
import SettingsLayout from "../../../layout/SettingsLayout"
import PdfCreator from "./partials/PdfCreator"

 
export default function CreateDocumentPage() {
 

  return (
    <SettingsLayout>

 documents 

 <PdfCreator/>
            </SettingsLayout>
  )
}
