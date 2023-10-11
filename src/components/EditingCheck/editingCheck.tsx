import React, { useEffect, useRef, useState } from 'react'
import PartySocket from 'partysocket'
import { MinimalTemplate } from 'payload/components/templates'
import { useDocumentInfo } from 'payload/components/utilities'
import { useTheme } from 'payload/dist/admin/components/utilities/Theme'

interface CustomButtonProps {
  label: String
  type?: 'primary' | 'secondary'
  onClick: () => void
}

const CustomButton = ({ label, type = 'primary', onClick }: CustomButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`btn btn--icon-style-without-border btn--size-medium btn--icon-position-right ${
      type === 'primary' ? 'btn--style-primary' : 'btn--style-secondary'
    }`}
  >
    <span className="btn__content">
      <span className="btn__label">{label}</span>
    </span>
  </button>
)

export const EditingCheck = () => {
  const { id, slug } = useDocumentInfo()
  const { theme } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const wasModalOpenedRef = useRef(false)

  const room = `${slug}-${id}`
  const baseClass = 'delete-document' // we need the same class for the modal as the exclude button

  useEffect(() => {
    if (!id) {
      return
    }

    // Connect to server
    const partySocket = new PartySocket({
      host: process.env.PAYLOAD_PUBLIC_PARTY_URL || 'localhost://1999',
      room,
    })

    // When we enter the room, we (and only we) get all the connections
    // Whenever someone leaves the room, everyone get a message with all the connections
    partySocket.addEventListener('message', e => {
      const editingId = e.data

      if (editingId === partySocket.id) {
        // No one is editing this document
        // We ensure that we get the latest version of the document if this conn was waiting
        if (wasModalOpenedRef.current) {
          window.location.reload()
        }
      } else {
        // Someone is editing this document
        setModalOpen(true)

        // Update the ref to indicate that the modal has been opened
        wasModalOpenedRef.current = true
      }
    })

    // Close the connection when the component unmounts
    return () => {
      partySocket.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!modalOpen) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${
          theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(23, 23, 23, 0.9)'
        }`,
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        transition: 'opacity 250ms linear',
      }}
    >
      <MinimalTemplate className={`${baseClass}__template`}>
        <h1>Someone is editing this content...</h1>
        <p>
          Please <strong>wait</strong> until they are finished.
        </p>
        <div className={`${baseClass}__actions`}>
          <CustomButton
            label="Go back"
            type="secondary"
            onClick={() => history.back()}
          ></CustomButton>
          {/* <CustomButton
            label="Go back"
            type="primary"
            onClick={() => history.back()}
          ></CustomButton> */}
        </div>
      </MinimalTemplate>
    </div>
  )
}
