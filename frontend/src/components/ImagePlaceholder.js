import React from 'react';

const ImagePlaceholder = ({ type, className = '' }) => {
  const getImageStyle = () => {
    const styles = {
      dashboard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '👥'
      },
      attendance: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        emoji: '⏰'
      },
      history: {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        emoji: '📊'
      },
      reports: {
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        emoji: '📈'
      },
      manager: {
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        emoji: '🎯'
      },
      login: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '🔐'
      },
      register: {
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        emoji: '👤'
      },
      default: {
        background: 'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
        emoji: '💼'
      }
    };

    return styles[type] || styles.default;
  };

  const style = getImageStyle();

  return (
    <div 
      className={`image-placeholder ${className}`}
      style={{ background: style.background }}
    >
      <div className="placeholder-emoji">
        {style.emoji}
      </div>
      <div className="placeholder-gradient"></div>
    </div>
  );
};

export default ImagePlaceholder;