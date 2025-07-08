import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error(
    "ERRORE: La variabile d'ambiente GEMINI_API_KEY non è impostata. Assicurati di averla nel tuo file .env"
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.use(express.json());
app.use(cors());

app.post("/api/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ error: 'Il campo "prompt" è obbligatorio.' });
    }

    // Seleziona il modello (es. "gemini-pro" per solo testo)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Genera il contenuto
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Estrai solo il testo dalla risposta

    // Invia la risposta testuale al frontend
    res.json({ generatedText: text });
  } catch (error) {
    console.error("Errore durante la chiamata a Gemini API:", error);
    // Invia un errore più generico al frontend per sicurezza
    res.status(500).json({
      error: "Errore interno del server durante la generazione del testo.",
    });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server Express in ascolto sulla porta ${port}`);
  console.log(`Apri il browser su http://localhost:${port}`);
});
