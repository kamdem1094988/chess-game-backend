// src/global.d.ts

// Estende l'interfaccia Request di Express per includere una proprietà "user".
// In questo modo, nei controller e middleware possiamo accedere a req.user senza errori di tipizzazione.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

// Dichiarazione per il modulo 'js-chess-engine'.
// Poiché il modulo "js-chess-engine" non fornisce tipi TypeScript ufficiali, 
// definiamo il modulo in modo che TypeScript lo accetti come "any".
// Ciò permette di importare il modulo usando la sintassi ES6 senza errori di tipizzazione.
declare module 'js-chess-engine' {
  const jsChessEngine: any;
  export default jsChessEngine;
}

// Export vuoto per forzare TypeScript a considerare questo file come un modulo.
export {};
