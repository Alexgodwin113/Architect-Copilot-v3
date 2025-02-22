import { CommandBarButton, DefaultButton, IButtonProps } from '@fluentui/react';
import styles from './Button.module.css';
import { Share20Regular, History20Regular } from '@fluentui/react-icons';


interface ButtonProps extends IButtonProps {
  onClick: () => void;
  text: string;
}

export const ShareButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <CommandBarButton
      className={styles.shareButtonRoot}
      onClick={onClick}
    >
      <Share20Regular className={styles.icon} /> 
      <span>{text}</span>
    </CommandBarButton>
  );
};

export const HistoryButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <DefaultButton
      className={styles.historyButtonRoot}
      onClick={onClick}
    >
      <History20Regular className={styles.icon} /> 
      <span>{text}</span>
    </DefaultButton>
  );
};
