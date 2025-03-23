const errorTemplateCss = `
  .body {
    background-color: white;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
`

const errorTemplateHtml = (error, nonce) => `
<html>
<head>
  <title>Error ${error.status}</title>
  <style nonce="${nonce}">${errorTemplateCss}</style>
</head>
<body class="body">
    <div class="container">
        <p class="error-message" nonce="${nonce}">${error.message}</p>
    </div>
</body>
</html>
`;

export { errorTemplateHtml };