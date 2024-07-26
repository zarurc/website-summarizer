# Website Summarizer

Website Summarizer is a minimalist Chrome extension that allows users to summarize web pages or selected text on a web page. This extension leverages OpenAI's GPT-4o-mini model to provide quick and accurate summaries, making it easier to digest large amounts of information.

## Features

- **Summarize Text**: Summarize the entire web page or selected text.
- **Preview Text**: Preview the text that will be summarized.
- **Clear Text**: Clear the summary and preview text.
- **History**: Maintain a history of the last 10 summaries, with expandable/collapsible summaries and the ability to delete history items.
- **Dynamic Buttons**: Buttons update based on whether text is selected or not.
- **Settings Page**: Easy management of OpenAI API key through a user-friendly settings page.

## Prerequisites

To use this extension, you need a ChatGPT API key from OpenAI.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/website-summarizer.git
    cd website-summarizer
    ```

2. **Load the extension in Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer mode" using the toggle in the top right corner.
    - Click "Load unpacked" and select the directory where you cloned the repository.

## Getting an API Key from OpenAI

1. **Sign up or log in to OpenAI**:
   - Go to the [OpenAI API page](https://beta.openai.com/signup/) and sign up for an account if you don't already have one.

2. **Create a new API key**:
   - Once you are logged in, navigate to the API keys section.
   - Click on "Create new secret key" and give your API key a name.
   - Copy the generated API key. You will use this key in the extension.

## Adding the API Key to the Extension

1. **Open the extension settings**:
   - Click on the Website Summarizer extension icon in the Chrome toolbar.
   - Click on the "Settings" link at the bottom of the popup.

2. **Add the API key**:
   - In the settings page, click on the "Add API key" button.
   - Enter your API key in the input field and click "Save".
   - Your API key will be stored securely and used for making requests to OpenAI.

## Usage

1. **Summarize Text**:
   - Select text on a web page and click "Summarize Selected Text" in the extension popup.
   - If no text is selected, click "Summarize Page" to summarize the entire page content.

2. **Preview Text**:
   - Select text on a web page and click "Preview Selected Text" in the extension popup.
   - If no text is selected, click "Preview Page" to preview the entire page content.

3. **Clear Text**:
   - Click the "Clear Text" button to clear the summary and preview text.

4. **View and Manage History**:
   - Summaries are saved in the history section of the popup.
   - Click on a summary to expand or collapse it.
   - Click the delete button next to a summary to remove it from the history.

## Contributing

We welcome contributions to improve Website Summarizer! Here’s how you can help:

- **Feature Requests**: Open an issue to discuss the feature you would like to see.
- **Bug Reports**: If you find a bug, please open an issue with details on how to reproduce it.
- **Pull Requests**: Fork the repository, make your changes in a new branch, and submit a pull request. Please follow the guidelines in the `CONTRIBUTING.md` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenAI](https://www.openai.com) for providing the GPT-4o-mini model.

## Contact

For any inquiries or questions, please open an issue or contact us at [zarurc@gmail.com].
