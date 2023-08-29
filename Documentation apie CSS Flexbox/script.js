document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.querySelector('.code-copy-button');
    const codeSnippet = document.querySelector('code');
  
    copyButton.addEventListener('click', () => {
      const textarea = document.createElement('textarea');
      textarea.value = codeSnippet.textContent;
      document.body.appendChild(textarea);
  
      textarea.select();
      document.execCommand('copy');
  
      document.body.removeChild(textarea);
  
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    });
  });