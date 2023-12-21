import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const QueryForm = () => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuestion(event.target.value);
  };

  const fetchData = async () => {
    if (question === "") return;

    setIsLoading(true);
    try {
      // Make the API call
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "starling-lm",
        prompt: question,
        stream: false,
      });

      // Handle the response
      setAIResponse(response.data.response);
      // Reset the question input
      setQuestion("");
    } catch (error) {
      console.error(error); // Handle the error
    }
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <Form.Root className="FormRoot" onSubmit={handleSubmit}>
      <Form.Field className="FormField" name="question">
        <div className="flex items-baseline justify-between">
          <Form.Label className="FormLabel">Question</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter a question
          </Form.Message>
        </div>
        <Form.Control asChild>
          <textarea
            className="Textarea"
            value={question}
            onChange={handleQuestionChange}
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button className="Button" style={{ marginTop: 10 }}>
          Post question
        </button>
      </Form.Submit>
      <hr className="border-t-2 border-gray-300 my-4" />
      {isLoading ? (
        <h1>thinking...</h1>
      ) : (
        aiResponse && (
          <div className="AIResponse">
            AI response: <span className="ResponseText">{aiResponse}</span>
          </div>
        )
      )}
    </Form.Root>
  );
};

export default QueryForm;
