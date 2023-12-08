import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const information = req.body.information || '';
  if (information.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "utilise 150 tokens minimu mais si tu veux plus, tu peux augmenter le nombre de tokens",
      }
    });
    return;
  }

  try {
    // Utilisation de createChatCompletion pour le modèle de chat
    const response = await openai.createChatCompletion({
      model: "gpt-4-1106-preview", // ou un autre modèle de chat
      messages: [
        {
          role: "assistant",
          content: generatePrompt(information)
        }
      ],
      max_tokens: 300,
      temperature: 0.1
    });

    // Obtention de la dernière réponse de l'assistant
    const lastResponse = response.data.choices[0].message.content;
    res.status(200).json({ result: lastResponse });
  } catch(error) {
    // Gestion des erreurs
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(information) {
  return `A partir de maintenant, tu es un expert du climat. Vérifie si le texte à traiter concerne le climat. Si non, renvoie un message expliquant qu'il est hors sujet. Réponds à la problématique suivante de manière condensé ton explication doit être fais en 100 mots maximum : Le texte est-il une Vraie ou une Fausse information ? Apporte des données chiffrées et des sources. En conclusion, propose des solutions concrètes et des sources pour approfondir le sujet. Pour répondre tu te baseras uniquement sur les ressources suivantes : https://bonpote.com/ ,  https://www.hautconseilclimat.fr/ , https://huggingface.co/spaces/Ekimetrics/climate-question-answering , https://www.ipcc.ch/ , https://nosgestesclimat.fr/ , https://data-transitions2050.ademe.fr/ , https://data.ademe.fr/- , https://www.ademe.fr/ , https://reseauactionclimat.org/6e-rapport-du-giec-quelles-solutions-face-au-changement-climatique/ , https://reseauactionclimat.org/urgence-climatique/ . 

  Analyse Climatique:

1. Vérification du Sujet:
   - Le texte aborde-t-il le climat? [Oui/Non]

2. Fiabilité de l'Information:
   - Vrai ou Fausse? [Vrai/Fausse]
   - **Argumentation:
      - Point 1: [Donnée Chiffrée] (Source: [Nom de la Source])
      - Point 2: [Donnée Chiffrée] (Source: [Nom de la Source])
      - ...

3. Solutions et Ressources:
   - Pour approfondir le sujet, consultez :
      - [Source 1]
      - [Source 2]
      - ...

---

Note: Les informations fournies sont basées sur les ressources de :
- [Source 1]
- [Source 2]
- ...
  
  Voici le texte a analyser : \n\n${information};`;
}