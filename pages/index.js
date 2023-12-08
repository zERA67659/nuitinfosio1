import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import link from "next/link";

export default function Home() {
  const [infoInput, setInfoInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ information: infoInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error.message || `Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setInfoInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
      <div>
        <Head>
          <title>Vérification d'Informations Environnementales</title>
          <link rel="icon" href="/environment-icon.png" />
        </Head>

        <main className={styles.main}>
          <h3>Vérification d'Informations Environnementales</h3>
          <form onSubmit={onSubmit}>
            <input
                type="text"
                name="information"
                placeholder="Entrez des informations environnementales ici"
                value={infoInput}
                onChange={(e) => setInfoInput(e.target.value)}
            />
            <input type="submit" value="Vérifier l'information" />
          </form>
          <div className={styles.result}>{result}</div>
          <a href="/page1">Lien vers la page 1</a>
          <a href="/page2">Lien vers la page 2</a>
          <a href="/page3">Lien vers la page 3</a>


        </main>
      </div>
  );
}
