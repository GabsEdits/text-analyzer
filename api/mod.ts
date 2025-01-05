import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.use(
  "*",
  (
    c: { res: { headers: { set: (arg0: string, arg1: string) => void } } },
    next: () => Promise<void>,
  ) => {
    c.res.headers.set("Access-Control-Allow-Origin", "*");
    c.res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST",
    );
    c.res.headers.set("Acess-Control-Allow-Header", "Content-Type");
    return next();
  },
);

function analyzeText(text: string) {
  const charactersCount = text.length;
  const words = text.split(/\s+/);
  const wordsCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const sentencesCount = sentences.length;
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
  const uniqueWordCount = uniqueWords.size;
  const averageSentenceLength = wordsCount / sentencesCount;

  const mostUsedWord = words.reduce((acc, word) => {
    const lowerWord = word.toLowerCase();
    acc[lowerWord] = (acc[lowerWord] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostUsedWordEntry = Object.entries(mostUsedWord).reduce((a, b) =>
    b[1] > a[1] ? b : a
  );

  const readingTime = Math.ceil(wordsCount / 200); // assuming average reading speed of a human is 200 words per minute (English)

  // Flesh-Kincaid Grade Level calculation
  const syllableCount = text.split(/\b/).reduce(
    (acc, word) => acc + word.replace(/[^aeiouy]/g, "").length,
    0,
  );
  const fleshKincaidGradeLevel = 0.39 * (wordsCount / sentencesCount) +
    11.8 * (syllableCount / wordsCount) - 15.59;

  return {
    charactersCount,
    wordsCount,
    sentencesCount,
    fleshKincaidGradeLevel,
    readingTime,
    mostUsedWord: mostUsedWordEntry[0],
    uniqueWordCount,
    averageSentenceLength,
  };
}

function getTextParam(c: { req: { param: (arg: string) => string } }) {
  return decodeURIComponent(c.req.param("text"));
}

app.get("/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const analysis = analyzeText(text);
  return c.json(analysis);
});

app.get("/characters/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  return c.json({ charactersCount: text.length });
});

app.get("/words/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const wordsCount = text.split(/\s+/).length;
  return c.json({ wordsCount });
});

app.get("/sentences/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const sentencesCount = text.split(/[.!?]+/).filter(Boolean).length;
  return c.json({ sentencesCount });
});

app.get("/flesh-kincaid/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const wordsCount = text.split(/\s+/).length;
  const sentencesCount = text.split(/[.!?]+/).filter(Boolean).length;
  const syllableCount = text.split(/\b/).reduce(
    (acc, word) => acc + word.replace(/[^aeiouy]/g, "").length,
    0,
  );
  const fleshKincaidGradeLevel = 0.39 * (wordsCount / sentencesCount) +
    11.8 * (syllableCount / wordsCount) - 15.59;
  return c.json({ fleshKincaidGradeLevel });
});

app.get("/reading-time/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const wordsCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordsCount / 200);
  return c.json({ readingTime });
});

app.get("/most-used-word/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const words = text.split(/\s+/);
  const mostUsedWord = words.reduce((acc, word) => {
    const lowerWord = word.toLowerCase();
    acc[lowerWord] = (acc[lowerWord] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostUsedWordEntry = Object.entries(mostUsedWord).reduce((a, b) =>
    b[1] > a[1] ? b : a
  );
  return c.json({ mostUsedWord: mostUsedWordEntry[0] });
});

app.get("/unique-words/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const words = text.split(/\s+/);
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
  return c.json({ uniqueWordCount: uniqueWords.size });
});

app.get("/average-sentence-length/:text", (c: { req: { param: (arg: string) => string }, json: (arg: Record<string, unknown>) => Response }) => {
  const text = getTextParam(c);
  const wordsCount = text.split(/\s+/).length;
  const sentencesCount = text.split(/[.!?]+/).filter(Boolean).length;
  const averageSentenceLength = wordsCount / sentencesCount;
  return c.json({ averageSentenceLength });
});

app.notFound((c: { text: (arg0: string, arg1: number) => Response }) => c.text("Not Found", 404));

Deno.serve({ port: 8001 }, app.fetch);

export { app };
