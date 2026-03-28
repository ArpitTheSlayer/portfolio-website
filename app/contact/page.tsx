'use client'

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import Image from "next/image"
import { useState } from "react"
import email from '@/assets/images/email.png'
import linkedin from '@/assets/images/linkedin.png'
import github from '@/assets/images/github.png'
import Link from "next/link"

const page = () => {
  const [result, setResult] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: any) => {
    setResult('')
    setIsSubmitting(true)
    e.preventDefault()
    const formData = new FormData(e.target)
    if (!process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY) {
      throw new Error("Missing Web3Forms access key");
    }
    formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    data.message && setIsSubmitting(false)
    setResult(data.success ? 'Thank you for contacting me!' : 'Error! Try Again!')
  }

  return (
    <div>
      <Navbar />
      <div className="px-4">
        <div className="border border-tia-maria-950 dark:border-tia-maria-50 p-8 rounded-lg w-full md:max-w-160 mx-auto">
          <h1 className="text-h1 text-center mb-8">Contact Form</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Name" className="outline-1 outline-tia-maria-950 dark:outline-tia-maria-50 px-4 py-2 rounded-sm" required />
            <input type="email" name="email" placeholder="example@email.com" className="outline-1 outline-tia-maria-950 dark:outline-tia-maria-50 px-4 py-2 rounded-sm" required />
            <textarea name="message" placeholder="Message" rows={4} className="outline-1 outline-tia-maria-950 dark:outline-tia-maria-50 px-4 py-2 rounded-sm" required></textarea>
            <button type="submit" disabled={isSubmitting} className="bg-tia-maria-500 disabled:bg-gray-500 hover:bg-tia-maria-600 transition-all text-tia-maria-50 px-6 py-2 rounded-sm cursor-pointer">
              Submit
            </button>
            <p className="text-center font-bold">{result}</p>
          </form>
        </div>
      </div>
      <div className="px-4 mt-8">
        <div className="border border-tia-maria-950 dark:border-tia-maria-50 p-8 rounded-lg w-full md:max-w-160 mx-auto">
          <h1 className="text-h1 text-center mb-8">Socials</h1>
          <div className="mx-4 md:mx-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Image src={email} alt="Email Icon" className="size-8" />
              <p className="cursor-pointer" title="Click to copy" onClick={(e) => {
                navigator.clipboard.writeText(e.currentTarget.innerText)
                alert('Email copied to clipboard!')
              }}>arpitpandey.2001@gmail.com</p>
            </div>
            <Link href={'https://github.com/arpittheslayer'} target="_blank">
              <div className="flex items-center gap-4">
                <Image src={github} alt="Email Icon" className="size-8" />
                <p className="hover:underline">github.com/arpittheslayer</p>
              </div>
            </Link>
            <Link href={'https://linkedin.com/in/arpittheslayer/'} target="_blank">
              <div className="flex items-center gap-4">
                <Image src={linkedin} alt="Email Icon" className="size-8" />
                <p className="hover:underline">linkedin.com/in/arpittheslayer</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page