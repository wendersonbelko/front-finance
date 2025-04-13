import React from 'react';
import styled from 'styled-components';

interface AvatarProps {
  name: string;
  size?: number; // Tamanho padrão: 24px
  shape?: 'square' | 'round';
  backgroundColor?: string; // Cor de fundo opcional
  url?: string; // URL da imagem do avatar
  tooltip?: string; // Texto exibido no tooltip customizado
  pointer?: boolean; // Se true, cursor pointer; caso contrário, default
  onClick?: () => void; // Função a ser chamada no clique
}

// Função para extrair as iniciais a partir do nome
const getInitials = (name: string): string => {
  const nameParts = name.split(' ').filter(Boolean);
  if (nameParts.length === 0) return '';
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (
    nameParts[0].charAt(0).toUpperCase() +
    nameParts[1].charAt(0).toUpperCase()
  );
};

// Função para gerar uma cor hexadecimal aleatória
const randomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface StyledAvatarProps {
  size: number;
  shape: 'square' | 'round';
  backgroundColor: string;
  $pointer: boolean;
}

const StyledAvatar = styled.div<StyledAvatarProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size / 2}px;
  font-weight: bold;
  border-radius: ${({ shape }) => (shape === 'round' ? '50%' : '5px')};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'default')};
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

// Tooltip customizado que segue o mouse
const Tooltip = styled.div`
  position: fixed;
  pointer-events: none;
  background-color: #333;
  color: #fff;
  border: 1px solid #000;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
`;

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 24,
  shape = 'square',
  backgroundColor,
  url,
  tooltip,
  pointer = false,
  onClick,
}) => {
  // Memoriza a cor de fundo para evitar recalcular a cada re-render
  const bgColor = React.useMemo(
    () => backgroundColor || randomColor(),
    [backgroundColor]
  );
  const initials = getInitials(name);
  
  // Apenas controla a visibilidade do tooltip
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  // Ref para atualizar a posição do tooltip sem re-renderizar o componente
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setTooltipVisible(true);
  const handleMouseLeave = () => setTooltipVisible(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.top = e.clientY + 10 + "px";
      tooltipRef.current.style.left = e.clientX + 10 + "px";
    }
  };

  return (
    <div
      style={{ display: 'inline-block', margin: '4px' }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <StyledAvatar
        size={size}
        shape={shape}
        backgroundColor={bgColor}
        $pointer={pointer}
      >
        {url ? <AvatarImage src={url} alt={name} /> : initials}
      </StyledAvatar>
      {tooltipVisible && tooltip && (
        <Tooltip ref={tooltipRef}>{tooltip}</Tooltip>
      )}
    </div>
  );
};

export default Avatar;
