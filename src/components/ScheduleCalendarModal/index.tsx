import { useState } from 'react'
import { X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

import { CloseButton, Content, Overlay } from './styles'

interface ScheduleCalendarModalProps {
  events: { title: string; start: string; end?: string; description?: string }[]
}

export function ScheduleCalendarModal({ events }: ScheduleCalendarModalProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Dialog.Title>Agenda</Dialog.Title>

          <CloseButton asChild>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </CloseButton>

          <div style={{ flex: 1, overflow: 'auto' }}>
            <FullCalendar
              locale={ptBrLocale}
              initialDate={new Date()}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              eventDidMount={(info) => {
                const description = info.event.extendedProps.description
                if (description) {
                  tippy(info.el, {
                    content: `<strong>${info.event.title}</strong><br/>${description}`,
                    allowHTML: true,
                    placement: 'top',
                    theme: 'light-border',
                  })
                }
              }}
              height="auto"
            />
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
