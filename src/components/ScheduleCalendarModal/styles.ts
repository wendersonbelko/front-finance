import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
`

export const Content = styled(Dialog.Content)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${(props) => props.theme['gray-800']};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h2, h3, h4, h5, h6, p, span, th, td {
    color: ${(props) => props.theme['gray-100']};
  }

  .fc {
    background-color: ${(props) => props.theme['gray-800']};
    color: ${(props) => props.theme['gray-100']};
  }

  .fc-daygrid-day, 
  .fc-event, 
  .fc-button {
    cursor: pointer;
  }

  .fc-daygrid-day:hover {
    background-color: ${(props) => props.theme['gray-700']};
    transition: background-color 0.2s;
  }

  .fc .fc-toolbar-title {
    color: ${(props) => props.theme['gray-100']};
  }

  .fc-col-header-cell-cushion {
    color: ${(props) => props.theme['gray-700']};
  }

  .fc-day-today {
    background-color: ${(props) => props.theme['green-500']}22;
  }

  .fc-event {
    background-color: ${(props) => props.theme['green-500']};
    border: none;
    color: ${(props) => props.theme['gray-100']};
    font-weight: bold;
  }

  .fc-button {
    background-color: ${(props) => props.theme['gray-700']};
    color: ${(props) => props.theme['gray-100']};
    border: none;
  }

  .fc-button:hover {
    background-color: ${(props) => props.theme['green-500']};
    color: ${(props) => props.theme['gray-100']};
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme['gray-700']};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme['green-500']};
    border-radius: 3px;
  }

  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme['green-500']} ${(props) => props.theme['gray-700']};
`

export const CloseButton = styled(Dialog.Close)`
  position: absolute;
  background: transparent;
  border: 0;
  top: 1.5rem;
  right: 1.5rem;
  line-height: 0;
  cursor: pointer;
  color: ${(props) => props.theme['gray-100']};
`
