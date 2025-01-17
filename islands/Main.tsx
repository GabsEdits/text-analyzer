import { useState } from "preact/hooks";
import Input from "./Input.tsx";

export default function Main() {
  const [stats, setStats] = useState([
    { title: "Characters", value: "0" },
    { title: "Words", value: "0" },
    { title: "Sentences", value: "0" },
  ]);

  const [readabilityMetrics, setReadabilityMetrics] = useState([
    { title: "Flesch-Kincaid Grade Level", value: "0", suffix: "/ 12" },
    { title: "Reading Time", value: "~0", suffix: "minutes" },
  ]);

  const [textComposition, setTextComposition] = useState([
    { title: "Most Used Word", value: "None" },
    { title: "Unique Word Count", value: "None" },
    { title: "Average Sentence Length", value: "0", suffix: "words" },
  ]);

  const [error, setError] = useState("");
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event: Event) => {
    const text = (event.target as HTMLTextAreaElement).value;
    setInputText(text);
    if (text.length < 10) {
      setError("Please enter more text (at least 10 characters)");
      return;
    }
    setError("");
    fetch(`https://text-analyzer-api.deno.dev/${encodeURIComponent(text)}`)
      .then((response) => response.json())
      .then((data) => {
        setStats([
          { title: "Characters", value: data.charactersCount.toString() },
          { title: "Words", value: data.wordsCount.toString() },
          { title: "Sentences", value: data.sentencesCount.toString() },
        ]);

        setReadabilityMetrics([
          {
            title: "Flesch-Kincaid Grade Level",
            value: Math.round(data.fleshKincaidGradeLevel).toString(),
            suffix: "/ 12",
          },
          {
            title: "Reading Time",
            value: `~${data.readingTime}`,
            suffix: "minutes",
          },
        ]);

        setTextComposition([
          { title: "Most Used Word", value: data.mostUsedWord },
          {
            title: "Unique Word Count",
            value: data.uniqueWordCount.toString(),
          },
          {
            title: "Average Sentence Length",
            value: Math.round(data.averageSentenceLength).toString(),
            suffix: "words",
          },
        ]);
      });
  };

  const renderCard = (
    item: { title: string; value: string; suffix?: string },
  ) => (
    <div class="flex flex-col items-center justify-center px-4 py-4 bg-zinc-100 dark:bg-zinc-900 size-full">
      <h3 class="text-lg font-semibold">{item.title}</h3>
      <div class="flex flex-col gap-1 items-center justify-center">
        <p class="text-3xl font-serif">{item.value}</p>
        {item.suffix && <p class="text-sm">{item.suffix}</p>}
      </div>
    </div>
  );

  const exportToCSV = () => {
    const allData = [...stats, ...readabilityMetrics, ...textComposition];
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      allData.map((item) => `${item.title},${item.value + (item.suffix || "")}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "text_analyzer_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div class="flex flex-col py-10 gap-4">
      <h1 class="text-3xl font-serif text-center">Text Analyzer</h1>

      <Input onChange={handleInputChange} />
      {error && <p class="text-red-500 text-center">{error}</p>}

      <div class="flex flex-nowrap flex-col md:flex-row items-start justify-center gap-4">
        <div class="flex flex-col items-center gap-2 justify-center lg:h-[30rem] w-full md:w-1/3">
          <h2 class="text-2xl font-serif">Basic Stats</h2>
          <div class="flex flex-col items-center gap-2 flex-1 overflow-hidden rounded-xl w-full">
            {stats.map((item) => renderCard(item))}
          </div>
        </div>

        <div class="flex flex-col items-center gap-2 justify-center lg:h-[30rem] w-full md:w-1/3">
          <h2 class="text-2xl font-serif">Readability Metrics</h2>
          <div class="flex flex-col items-center gap-2 flex-1 overflow-hidden rounded-xl w-full">
            {readabilityMetrics.map((item) => renderCard(item))}
          </div>
        </div>

        <div class="flex flex-col items-center gap-2 justify-center lg:h-[30rem] w-full md:w-1/3">
          <h2 class="text-2xl font-serif">Text Composition</h2>
          <div class="flex flex-col items-center gap-2 flex-1 overflow-hidden rounded-xl w-full">
            {textComposition.map((item) => renderCard(item))}
          </div>
        </div>
      </div>

      <div class="flex flex-row items-center justify-center gap-4">
        <button
          onClick={exportToCSV}
          class="py-2 px-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}
