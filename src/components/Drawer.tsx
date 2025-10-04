import './Drawer.css'
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import { IoCloseSharp } from 'react-icons/io5'

type DrawerSize = 'sm' | 'md' | 'lg'

export type DrawerRef = {
  triggerClose: () => void
  triggerOpen: () => void
}

type DrawerProps = {
  onClose: () => void
  children?: React.ReactNode
  size?: DrawerSize
}

const Drawer = forwardRef<DrawerRef, DrawerProps>(
  ({ onClose, children, size = 'md' }, ref) => {
    const drawerRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useImperativeHandle(ref, () => ({
      triggerOpen,
      triggerClose
    }))

    function triggerOpen() {
      setIsOpen(true)
      setIsClosing(false)
    }

    function triggerClose() {
      setIsClosing(true)
      setTimeout(() => {
        setIsOpen(false)
        onClose()
      }, 300)
    }

    // Click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
          triggerClose()
        }
      }
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // ESC key to close
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') triggerClose()
      }
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
      }
    }, [isOpen])

    // Disable background scroll
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = ''
        }
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <div className={`drawer-overlay${isClosing ? ' closing' : ''}`}>
        <div
          className={`drawer ${size} ${isClosing ? 'closing' : ''}`}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
        >
          <button className="drawer-close" onClick={triggerClose} title="Close">
            <IoCloseSharp size={30} />
          </button>
          <div className="drawer-content">{children}</div>
        </div>
      </div>
    )
  }
)

export default Drawer