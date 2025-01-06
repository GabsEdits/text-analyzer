import { useEffect } from "preact/hooks";

export default function Input(
  { onChange }: { onChange: (event: Event) => void },
) {
  const useSampleText = () => {
    const sampleText =
      "The little boy ran through the park, laughing as he chased his playful puppy. The sun shone brightly, casting warm light on the grassy fields and sparkling off the nearby pond. Families gathered for picnics, spreading colorful blankets and sharing sandwiches, fruit, and lemonade. Children played on swings, climbed trees, and rolled down gentle hills, their laughter echoing through the park. Parents sat on benches, chatting and keeping a watchful eye on their kids.";

    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = sampleText;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    console.log("Sample text added to textarea");
  };

  useEffect(() => {
    const button = document.getElementById("use-sample-text");
    if (button) {
      button.addEventListener("click", useSampleText);
    }

    return () => {
      if (button) {
        button.removeEventListener("click", useSampleText);
      }
    };
  }, []);

  return (
    <div class="flex flex-col gap-3 items-center justify-center w-full">
      <textarea
        class="dark:border-gray-700 h-52 p-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-full"
        placeholder="Enter your text here"
        style={{ resize: "none" }}
        onInput={onChange}
      >
      </textarea>

      <button
        class="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
        id="use-sample-text"
      >
        Use Sample Text
      </button>
    </div>
  );
}
