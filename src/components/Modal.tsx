import { createPortal } from 'react-dom'

import '../styles/modal.scss'
import { Button } from './Button'

export type ModalProps = {
  modalIcon?: string
  title: string
  content: string
  confirmMessage: string
  onClose: (confirm: boolean) => void
}

export function Modal({
  modalIcon,
  title,
  content,
  confirmMessage,
  onClose
}: ModalProps) {
  return createPortal(
    <>
      <div className="backdrop" aria-hidden="true"></div>
      <section className="modal" aria-hidden="true">
        <div className="modal-content">
          {modalIcon && <img src={modalIcon} alt="" />}
          <h1>{title}</h1>
          <p>{content}</p>
          <div className="modal-actions">
            <Button
              type="button"
              aria-label="close"
              onClick={onClose.bind(null, false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              aria-label="confirm"
              onClick={onClose.bind(null, true)}
            >
              {confirmMessage}
            </Button>
          </div>
        </div>
      </section>
    </>,
    document.getElementById('modal')!
  )
}
