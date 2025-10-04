import './ConfirmDialog.css'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="confirm-dialog-backdrop">
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} className="confirm-btn">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
