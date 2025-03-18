# Backend Scacchi (corso di PROGRAMMAZIONE AVANZATA A.A. 2024/2025)
# Backend Scacchi

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Docs](https://img.shields.io/badge/docs-passing-brightgreen.svg)](#)
[![OpenAPI Test Practices](https://img.shields.io/badge/openapi%20test%20practices-passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](#)
[![Docker Compose](https://img.shields.io/badge/docker--compose-ready-blue.svg)](#)
[![Chat on Slack](https://img.shields.io/badge/chat-join%20now-blue.svg)](#)

---

## Obiettivo del progetto

Il progetto ha lo scopo di realizzare un sistema backend per la gestione di un gioco di scacchi.  
L’utente autenticato, tramite token JWT, gioca contro un’intelligenza artificiale utilizzando il package [js-chess-engine](https://www.npmjs.com/package/js-chess-engine).  
Il sistema consente di:
- Creare nuove partite.
- Effettuare mosse (sia dell’utente che dell’IA).
- Gestire e monitorare il credito (token) dell’utente: 0,50 token vengono addebitati alla creazione della partita e 0,025 per ogni mossa (anche dell’IA), con la possibilità di continuare la partita anche se il credito scende sotto zero.
- Visualizzare lo storico delle mosse di una partita, il ranking dei giocatori e lo stato della partita (di chi è il turno, se è terminata, scacco, scacco matto, ecc.).
- Consentire all’admin di ricaricare il credito di un utente tramite una rotta dedicata.

---

## Ambiente operativo

Lo stack utilizzato dal progetto **Backend Scacchi** è composto da:

- **Node.js**  
  Runtime JavaScript open source e multipiattaforma, basato sul motore V8 di Google Chrome. Permette l'esecuzione del codice JavaScript lato server.

- **Express.js**  
  Framework per Node.js che facilita la creazione di applicazioni web e API, grazie al suo sistema di routing flessibile e alla gestione di middleware.

- **Sequelize**  
  ORM per Node.js che semplifica l'interazione con il database, gestendo modelli, relazioni e transazioni. Compatibile con TypeScript grazie a librerie come *sequelize-typescript*.

- **SQLite**  
  Database relazionale leggero e senza server, ideale per ambienti di sviluppo e per applicazioni di piccola scala.

- **TypeScript**  
  Il progetto è scritto interamente in TypeScript per garantire un sistema di tipi statici che migliora la robustezza e la manutenibilità del codice.

- **Docker e Docker Compose**  
  - **Docker:** Containerizza l'applicazione per garantire un ambiente isolato e facilmente distribuibile.
  - **Docker Compose:** Gestisce applicazioni multi-container; in questo progetto, Docker Compose coordina il container del backend (e, se necessario, altri servizi).

- **Live Reloading e Compilazione**  
  Durante lo sviluppo si utilizzano:
  - **nodemon** per il live reloading.
  - **tsc** in modalità watch per compilare automaticamente i file TypeScript.

---

## Diagrammi UML

### Diagramma dei casi d’uso

Il diagramma dei casi d’uso illustra le funzionalità principali:
- **Autenticazione:** L’utente può effettuare il login.
- **Gestione Partite:** Creazione, esecuzione di mosse, visualizzazione dello storico e dello stato della partita.
- **Gestione Credito:** Addebito di token per la creazione della partita e per ogni mossa; ricarica credito da parte dell’admin.
- **Ranking:** Visualizzazione del ranking dei giocatori.

![Diagramma dei casi d'uso](https://github.com/user-attachments/assets/f2313c99-f31a-4872-9474-a4df4bbdf77b)

### Diagramma delle sequenze

Il diagramma delle sequenze descrive il flusso per la creazione di una partita e l'esecuzione di una mossa:
- **Creazione partita:** L’utente invia una richiesta; il backend verifica il credito, deduce 0,50 token e crea la partita.
- **Effettuazione mossa:** L’utente invia la mossa; il backend la verifica tramite js-chess-engine, deduce 0,025 token e registra il movimento. Se necessario, l’IA esegue una mossa con ulteriori addebiti.

![Diagramma delle sequenze](https://github.com/user-attachments/assets/1fc46c46-444d-4395-a50d-ff4143e955c0)

---

## Principali Pattern utilizzati nel progetto

### Middleware Pattern
- **Descrizione:**  
  Permette di elaborare le richieste HTTP tramite una catena di funzioni.  
  Esempi:
  - `express.json()` per parsificare il body in JSON.
  - `jwtMiddleware` per verificare e decodificare il token JWT.
  - Middleware di gestione degli errori per intercettare e gestire le eccezioni.

### Chain of Responsibility
- **Descrizione:**  
  Una richiesta viene passata lungo una catena di gestori.  
  Nel nostro progetto, il `jwtMiddleware` decodifica il token e, se valido, passa la richiesta al successivo gestore.

### Data Access Object (DAO)
- **Descrizione:**  
  I modelli definiti con Sequelize (ad es. `User`, `Game`, `Move`) fungono da DAO, fornendo un'interfaccia standard per le operazioni CRUD sul database.

### Model-View-Controller (MVC)
- **Descrizione:**  
  L'applicazione è strutturata in tre livelli:
  - **Model:** Gestisce i dati e l'interazione con il database.
  - **View:** Le rotte che restituiscono dati in formato JSON.
  - **Controller:** Gestiscono le richieste, applicano la logica di business e restituiscono le risposte.

### Decorator Pattern
- **Descrizione:**  
  Permette di aggiungere funzionalità a classi o metodi in modo flessibile, senza modificare il codice originale.  
  Utilizzato con `sequelize-typescript` per definire i modelli in maniera dichiarativa.

### Promise Pattern
- **Descrizione:**  
  Fondamentale per la programmazione asincrona in JavaScript/TypeScript, consente di gestire operazioni in background in modo leggibile grazie a `async/await`.

---

## Application Programming Interface (API)

Le API implementate, la loro descrizione funzionale, le relative rotte, i payload, i risultati ed i possibili codici di errore sono testati con **postman**. Utilizzando questa interfaccia grafica intuitiva, è possibile:
- Visualizzare in dettaglio ogni endpoint e  la sua risposta .
- generare e usare il JWT.
- Esaminare i risultati e i codici di errore previsti.
- Interagire con gli endpoint .

**Scelta progettuale:**  
È stato deciso di permettere l'utilizzo delle rotte dedicate all'utente, prive di costo, anche all'amministratore. Le rotte che prevedono un costo (ad es. creazione partita e mossa) non vengono addebitate all'amministratore, poiché quest'ultimo non possiede crediti.

---

## Elenco delle Rotte

### Rotte Protette (token JWT richiesto)

1. **POST** `http://localhost:3000/games`  
   - Crea una nuova partita.

2. **POST** `http://localhost:3000/games/:id/move`  
   - Permette di effettuare una mossa in una partita specifica.

3. **GET** `http://localhost:3000/games/:id/history`  
   - Recupera lo storico dei movimenti di una partita specifica.

4. **GET** `http://localhost:3000/games/history`  
   - Recupera lo storico delle partite terminate. *(Aggiungi `?download=true` per forzare il download del JSON.)*

5. **GET** `http://localhost:3000/games/:id/status`  
   - Valuta lo stato di una partita (turno, scacco, scacco matto, ecc.) e gestisce i punteggi.

6. **POST** `http://localhost:3000/admin/recharge`  
   - Permette all'amministratore di ricaricare il credito di un utente.

### Rotte Non Protette

7. **POST** `http://localhost:3000/login`  
   - Autentica l'utente e restituisce un token JWT.

8. **GET** `http://localhost:3000/ranking`  
   - Restituisce il ranking degli utenti ordinato per score.

---

## Avvio del progetto mediante Docker Compose

![image](https://github.com/user-attachments/assets/9f9108fd-5d19-42ea-b1d8-16c72399fcc6)


Il sistema prevede l'utilizzo di container per garantire un ambiente isolato e facilmente distribuibile.  
In questo progetto, **Backend Scacchi** viene containerizzato tramite Docker Compose.  
Poiché utilizziamo SQLite per il database, non è necessario un container separato per il DB.

### Come avviare il progetto:

1. **Preparazione del progetto:**  
   - Scarica lo zip del progetto o clona il repository.
   - Decomprimilo nella tua directory di lavoro.  
     Supponiamo che la directory principale sia `${SC_ROOT}` (root del progetto).

2. **Configurazione del file `.env`:**  
   Crea un file `.env` nella root con le seguenti variabili (adatta i valori se necessario):
   ```dotenv
   PORT=3000
   JWT_SECRET=laTuaChiaveSegreta
   DATABASE_URL=sqlite://./database.sqlite

   **nel terminale di virtual studuo:** 
     docker-compose up --build
