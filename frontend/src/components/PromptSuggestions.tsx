import React from "react";
import styles from "./PromptSuggestions.module.css"; // Ensure this file exists

interface PromptSuggestionsProps {
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptClick }) => {
  const examplePrompts = [
    "What are some applications in Contoso with technical debt?",
    "What are the recommended architectural patterns for modernizing applications at Contoso?",
    "What are the recommended naming conventions that align with Contoso's business standards",
    "What are the key factors in deciding whether to rehost, refactor, rearchitect, or rebuild an application?",
    "How do I determine the best cloud migration strategy for my applications at Contoso?",
    "Can you provide details about uptime and availability standards at Contoso?"
  ];

  return (
    <div className={styles.promptGrid}>
      {examplePrompts.map((prompt, index) => (
        <button 
          key={index} 
          className={styles.promptBox} 
          onClick={() => onPromptClick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default PromptSuggestions;
