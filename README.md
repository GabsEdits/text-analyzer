<div align="center">
    <h1>Text Analyzer</h1>
    <p>An webapp & API that analyzes text and returns various statistics about it.</p>
</div>

## Features

- Word count
- Character count
- Sentence count
- Flesch-Kincaid readability test
- Reading time
- Most used words
- Unique word count
- Average sentence length
- Average word length

## API

The API is available at [text-analyzer-api.deno.dev](https://text-analyzer-api.deno.dev).

### Installation

(After cloning the repository, and installing Deno, and being in the root directory of the project)

### Running the API

```bash
deno run -N api/mod.ts
```

### Endpoints

> ![NOTE]
> Replace `:text` with the text you want to analyze.

- `/:text` - Analyze the text and return all the statistics in JSON format (including: word count, character count, sentence count, Flesch-Kincaid readability test, reading time, most used word, unique word count, average sentence length, average word length).
- `/words/:text` - Return the word count.
- `/characters/:text` - Return the character count.
- `/sentences/:text` - Return the sentence count.
- `/flesch-kincaid/:text` - Return the Flesch-Kincaid readability test.
- `/reading-time/:text` - Return the reading time.
- `/most-used-word/:text` - Return the most used word.
- `/unique-words/:text` - Return the unique word count.
- `/average-sentence-length/:text` - Return the average sentence length.
- `/unique-words/:text` - Return the average word length.

### Example

```bash
curl text-analyzer-api.deno.dev/This%20is%20an%20example%20text%20to%20analyze%20using%20%20the%20API%20endpoint.
```

## Webapp

The webapp is available at [ta.gxbs.dev](https://ta.gxbs.dev), and is built using [Fresh](https://fresh.deno.dev).

### Installation

(After cloning the repository, and installing Deno, and being in the root directory of the project)

```bash
deno install
```

### Running the Webapp

Development:

```bash
deno run start
```

Production:

```bash
deno run build
```

### Features

- All the features of the API, but in a user-friendly interface, with a text area to input the text to analyze, and a button to insert an sample text.
- Dark mode
- Responsive design
- Export the statistics to CSV

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
