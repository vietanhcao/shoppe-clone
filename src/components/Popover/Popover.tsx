import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  offset,
  safePolygon,
  shift,
  useFloating,
  useFocus,
  useHover,
  useInteractions
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ElementType, useId, useRef, useState } from 'react'

interface PopoverProps {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
}

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen
}: PopoverProps) {
  const id = useId()
  const arrowRef = useRef(null)
  const [isOpen, setIsOpen] = useState(initialOpen || false)

  const { refs, strategy, x, y, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(0),
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    whileElementsMounted: autoUpdate
  })

  const hover = useHover(context, {
    handleClose: safePolygon({
      requireIntent: false
    })
  })
  const focus = useFocus(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus])
  return (
    <div>
      <Element className={className} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </Element>
      {isOpen && (
        <FloatingPortal id={id}>
          <AnimatePresence>
            <motion.div
              // anination
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
              ref={refs.setFloating}
              {...getFloatingProps({
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }
              })}
            >
              <FloatingArrow ref={arrowRef} context={context} fill='white' className='!bottom-[99%] !z-10' />
              {renderPopover}
            </motion.div>
          </AnimatePresence>
        </FloatingPortal>
      )}
    </div>
  )
}
