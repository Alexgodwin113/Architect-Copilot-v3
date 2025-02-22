import { useContext, useState, useEffect } from 'react';
import { FontIcon, Stack, TextField } from '@fluentui/react';
import { SendRegular } from '@fluentui/react-icons';
import Send from '../../assets/Send.svg';
import styles from './QuestionInput.module.css';
import { ChatMessage } from '../../api';
import { AppStateContext } from '../../state/AppProvider';
import { resizeImage } from '../../utils/resizeImage';

interface Props {
  onSend: (question: ChatMessage['content'], id?: string) => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  conversationId?: string;
  selectedPrompt?: string;  // ✅ Ensure this prop is passed from Chat.tsx
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId, selectedPrompt }: Props) => {
  const [question, setQuestion] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isPromptUsed, setIsPromptUsed] = useState<boolean>(false); // ✅ Track if prompt was clicked

  const appStateContext = useContext(AppStateContext);
  const OYD_ENABLED = appStateContext?.state.frontendSettings?.oyd_enabled || false;

  // ✅ Ensure input updates when a prompt is clicked, but only if user hasn't typed manually
  useEffect(() => {
    if (selectedPrompt) {
      console.log("Updating QuestionInput:", selectedPrompt); // Debugging
      setQuestion(selectedPrompt);
      setIsPromptUsed(false); // Reset manual typing flag
    }
  }, [selectedPrompt]);
  

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await convertToBase64(file);
    }
  };

  const convertToBase64 = async (file: Blob) => {
    try {
      const resizedBase64 = await resizeImage(file, 800, 800);
      setBase64Image(resizedBase64);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return;
    }

    const questionContent: ChatMessage["content"] = base64Image
      ? [{ type: "text", text: question }, { type: "image_url", image_url: { url: base64Image } }]
      : question.toString();

    onSend(questionContent, conversationId);
    setBase64Image(null);

    if (clearOnSend) {
      setQuestion('');
      setIsPromptUsed(false); // ✅ Reset prompt usage after sending
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '');
    setIsPromptUsed(true); // ✅ Mark that the user is manually typing
  };

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />
      {!OYD_ENABLED && (
        <div className={styles.fileInputContainer}>
          <input
            type="file"
            id="fileInput"
            onChange={handleImageUpload}
            accept="image/*"
            className={styles.fileInput}
          />
          <label htmlFor="fileInput" className={styles.fileLabel} aria-label='Upload Image'>
            <FontIcon
              className={styles.fileIcon}
              iconName={'PhotoCollection'}
              aria-label='Upload Image'
            />
          </label>
        </div>
      )}
      {base64Image && <img className={styles.uploadedImage} src={base64Image} alt="Uploaded Preview" />}
      <div
        className={styles.questionInputSendButtonContainer}
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}
      >
        {disabled || !question.trim() ? (
          <SendRegular className={styles.questionInputSendButtonDisabled} />
        ) : (
          <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
        )}
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  );
};
