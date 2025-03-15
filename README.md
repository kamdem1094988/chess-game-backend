# Backend Scacchi corso di PROGRAMMAZIONE AVANZATA A.A. 2024/2025

## Obiettivo del progetto

Il progetto ha lo scopo di realizzare un sistema backend per la gestione di un gioco di scacchi. L’utente autenticato, tramite token JWT, gioca contro un’intelligenza artificiale utilizzando il package [js-chess-engine](https://www.npmjs.com/package/js-chess-engine). Il sistema consente di:
- Creare nuove partite.
- Effettuare mosse (sia dell’utente che dell’IA).
- Gestire e monitorare il credito (token) dell’utente: 0.50 token vengono addebitati alla creazione della partita e 0.025 per ogni mossa (anche dell’IA), con la possibilità di continuare la partita anche se il credito scende sotto zero.
- Visualizzare lo storico delle mosse di una partita, il ranking dei giocatori e lo stato della partita (di chi è il turno, se è terminata, scacco, scacco matto, ecc.).
- Consentire all’admin di ricaricare il credito di un utente tramite una rotta dedicata.

## Progettazione

### Diagrammi UML

#### Diagramma dei casi d’uso
Il diagramma dei casi d’uso illustra le funzionalità principali:
- **Autenticazione:** L’utente può effettuare il login.
- **Gestione Partite:** L’utente può creare una partita, effettuare mosse, visualizzare lo storico della partita e verificare lo stato della partita.
- **Gestione Credito:** Il sistema addebita token per la creazione della partita e per ogni mossa; l’admin può ricaricare il credito di un utente.
- **Ranking:** La rotta pubblica mostra il ranking dei giocatori.
![image](https://github.com/user-attachments/assets/f2313c99-f31a-4872-9474-a4df4bbdf77b)
*Nota: Inserire l’immagine del diagramma (ad es. `docs/UseCaseDiagram.png`)*

#### Diagramma delle sequenze

Il diagramma delle sequenze descrive il flusso per la creazione di una partita e l’effettuazione di una mossa:
- **Creazione partita:** L’utente invia una richiesta, il backend verifica il credito, deduce 0.50 token e crea la partita.
- **Effettuazione mossa:** L’utente invia la mossa, il backend verifica la validità della mossa tramite js-chess-engine, deduce 0.025 token e registra il movimento. Se necessario, l’IA esegue una mossa e viene addebitato un ulteriore costo.

![image](https://github.com/user-attachments/assets/1fc46c46-444d-4395-a50d-ff4143e955c0)



### Pattern di progettazione utilizzati

- **Middleware Pattern:**  
  Utilizzato per la gestione della validazione del token JWT e la gestione centralizzata degli errori. Questo pattern separa la logica di autenticazione dal resto dell’applicazione.
  
- **Service Layer Pattern:**  
  La logica di business (ad es. creazione delle partite, gestione delle mosse) è isolata in appositi servizi (`GameService`, `MoveService`), facilitando il testing e la manutenzione.
  
- **Repository Pattern:**  
  L'accesso al database è gestito tramite Sequelize, che funge da livello di astrazione per le operazioni CRUD, rendendo il codice più modulare e riutilizzabile.


  con questa immagine abbiamo  un breve riassunto  della vista architteturale dell processo di sviluppo
  ![image](https://github.com/user-attachments/assets/97211e12-2183-4775-82ca-0020d9dc4a38)


## Avvio del progetto mediante Docker Compose

Per avviare il progetto, posizionati nella root del progetto (dove si trovano i file `Dockerfile`, `docker-compose.yml`, `.env`, ecc.) ed esegui il comando:
![image](https://github.com/user-attachments/assets/4162e622-3a72-4248-ba05-64ea097a9492)
```bash
docker-compose up --build


## Avvio del progetto mediante Docker Compose ![image](https://github.com/user-attachments/assets/560d49aa-a037-4b0f-8144-30692ff11d7d)


Per avviare il progetto, assicurati di essere nella **root** (la cartella principale del progetto contenente `Dockerfile`, `docker-compose.yml`, `.env`, ecc.) ed esegui:

```bash
docker-compose up --build
# chess-game-backend
 
