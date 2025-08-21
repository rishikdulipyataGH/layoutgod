import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, Settings, AlertCircle, 
  Keyboard, Download, 
  BarChart3, History, Zap, Hash, Brain
} from 'lucide-react';
import KeyboardVisualization from './KeyboardVisualization';

// Types
type TestMode = 'time' | 'words' | 'quote' | 'custom';
type TestLanguage = 'english' | 'french' | 'spanish' | 'german' | 'javascript' | 'python' | 'typescript' | 'java' | 'cpp' | 'rust' | 'go' | 'html' | 'css' | 'php' | 'csharp';
type TestDifficulty = 'normal' | 'expert' | 'master';
type SpeedMetric = 'wpm' | 'cpm' | 'cps' | 'wps';

interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  keyStats: Record<string, { correct: number; incorrect: number }>;
  fingerStats: Record<string, { correct: number; incorrect: number; weakness: boolean }>;
  weakKeys: string[];
  mostMissedWords: string[];
  testDuration: number;
  timestamp: number;
  language: TestLanguage;
  mode: TestMode;
  difficulty: TestDifficulty;
}

interface UserProfile {
  totalTests: number;
  totalTimeSpent: number; // in seconds
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  testHistory: TestStats[];
  weakFingers: string[];
  weakKeys: string[];
  mostMissedWords: string[];
  currentStreak: number;
  longestStreak: number;
}

// Language content
const languageContent = {
  english: {
    words: [
      // Most common 500 English words
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
      'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
      'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
      'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
      'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
      // Common words 76-150
      'man', 'here', 'old', 'life', 'world', 'still', 'hand', 'place', 'while', 'where', 'much', 'those', 'right',
      'might', 'great', 'little', 'should', 'part', 'house', 'such', 'find', 'again', 'head', 'water', 'long', 'down',
      'call', 'own', 'move', 'face', 'door', 'cut', 'open', 'seem', 'together', 'white', 'children', 'side', 'feet',
      'car', 'mile', 'night', 'walk', 'color', 'watch', 'far', 'started', 'city', 'earth', 'eyes', 'light', 'thought',
      'close', 'something', 'special', 'working', 'against', 'red', 'problems', 'complete', 'room', 'knew', 'since',
      'ever', 'piece', 'told', 'usually', 'didn', 'friends', 'easy', 'heard', 'order', 'door', 'sure', 'become',
      // Common words 151-225
      'top', 'ship', 'across', 'today', 'during', 'short', 'better', 'best', 'however', 'low', 'hours', 'black', 'products',
      'happened', 'whole', 'measure', 'remember', 'early', 'waves', 'reached', 'listen', 'wind', 'rock', 'space',
      'covered', 'fast', 'several', 'hold', 'himself', 'toward', 'five', 'step', 'morning', 'passed', 'vowel', 'true',
      'hundred', 'against', 'pattern', 'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'pulled',
      'draw', 'voice', 'seen', 'cold', 'cried', 'plan', 'notice', 'south', 'sing', 'war', 'ground', 'fall', 'king',
      'town', 'unit', 'figure', 'certain', 'field', 'travel', 'wood', 'fire', 'upon', 'done', 'english', 'road',
      'half', 'ten', 'fly', 'gave', 'box', 'finally', 'wait', 'correct', 'oh', 'quickly', 'person', 'became', 'shown',
      // Common words 226-300
      'minutes', 'strong', 'verb', 'stars', 'eat', 'age', 'late', 'song', 'leave', 'family', 'body', 'music',
      'stand', 'sun', 'questions', 'fish', 'area', 'mark', 'dog', 'horse', 'birds', 'problem', 'complete',
      'though', 'language', 'shape', 'deep', 'thousands', 'yes', 'clear', 'equation', 'yet', 'government', 'filled',
      'heat', 'full', 'hot', 'check', 'object', 'am', 'rule', 'among', 'noun', 'power', 'cannot', 'able', 'six',
      'size', 'dark', 'ball', 'material', 'special', 'heavy', 'fine', 'pair', 'circle', 'include', 'built',
      'nothing', 'course', 'stay', 'wheel', 'full', 'force', 'blue', 'object', 'decide', 'surface', 'ocean',
      'moon', 'island', 'foot', 'system', 'busy', 'test', 'record', 'boat', 'common', 'gold', 'possible',
      // Common words 301-375
      'plane', 'instead', 'piece', 'told', 'usually', 'didn\'t', 'friends', 'easy', 'heard', 'order', 'red',
      'door', 'sure', 'become', 'top', 'ship', 'across', 'today', 'during', 'short', 'better', 'best',
      'however', 'low', 'hours', 'black', 'products', 'happened', 'whole', 'measure', 'remember', 'early',
      'waves', 'reached', 'listen', 'wind', 'rock', 'space', 'covered', 'fast', 'several', 'hold', 'himself',
      'toward', 'five', 'step', 'morning', 'passed', 'vowel', 'true', 'hundred', 'against', 'pattern',
      'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'pulled', 'draw', 'voice', 'seen',
      'cold', 'cried', 'plan', 'notice', 'south', 'sing', 'war', 'ground', 'fall', 'king', 'town', 'unit',
      // Common words 376-450
      'figure', 'certain', 'field', 'travel', 'wood', 'fire', 'upon', 'done', 'english', 'road', 'half',
      'ten', 'fly', 'gave', 'box', 'finally', 'wait', 'correct', 'oh', 'quickly', 'person', 'became',
      'shown', 'minutes', 'strong', 'verb', 'stars', 'eat', 'age', 'late', 'song', 'leave', 'family',
      'body', 'music', 'stand', 'sun', 'questions', 'fish', 'area', 'mark', 'dog', 'horse', 'birds',
      'problem', 'complete', 'though', 'language', 'shape', 'deep', 'thousands', 'yes', 'clear', 'equation',
      'yet', 'government', 'filled', 'heat', 'full', 'hot', 'check', 'object', 'am', 'rule', 'among',
      'noun', 'power', 'cannot', 'able', 'six', 'size', 'dark', 'ball', 'material', 'heavy', 'fine',
      'pair', 'circle', 'include', 'built', 'nothing', 'course', 'stay', 'wheel', 'force', 'blue',
      // Common words 451-500
      'decide', 'surface', 'ocean', 'moon', 'island', 'foot', 'system', 'busy', 'test', 'record', 'boat',
      'common', 'gold', 'possible', 'plane', 'instead', 'dry', 'wonder', 'laugh', 'thousands', 'ago',
      'ran', 'check', 'game', 'shape', 'equate', 'miss', 'brought', 'heat', 'snow', 'tire', 'bring',
      'yes', 'distant', 'fill', 'east', 'paint', 'language', 'among', 'grand', 'ball', 'yet', 'wave',
      'drop', 'heart', 'am', 'present', 'heavy', 'dance', 'engine', 'position', 'arm', 'wide', 'sail',
      'material', 'size', 'vary', 'settle', 'speak', 'weight', 'general', 'ice', 'matter', 'circle',
      'pair', 'include', 'divide', 'syllable', 'felt', 'perhaps', 'pick', 'sudden', 'count', 'square',
      'reason', 'length', 'represent', 'art', 'subject', 'region', 'energy', 'hunt', 'probable', 'bed',
      'brother', 'egg', 'ride', 'cell', 'believe', 'fraction', 'forest', 'sit', 'race', 'window',
      'store', 'summer', 'train', 'sleep', 'prove', 'lone', 'leg', 'exercise', 'wall', 'catch'
    ],
    quotes: [
      // Inspirational quotes
      "The only way to do great work is to love what you do.",
      "Innovation distinguishes between a leader and a follower.",
      "Your time is limited, don't waste it living someone else's life.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "It is during our darkest moments that we must focus to see the light.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The way to get started is to quit talking and begin doing.",
      "Don't let yesterday take up too much of today.",
      "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
      "If you are working on something that you really care about, you don't have to be pushed.",
      // Literature quotes
      "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
      "In three words I can sum up everything I've learned about life: it goes on.",
      "Be who you are and say what you feel, because those who mind don't matter and those who matter don't mind.",
      "We accept the love we think we deserve.",
      "It is better to be hated for what you are than to be loved for what you are not.",
      "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
      "The only impossible journey is the one you never begin.",
      "Life is what happens to you while you're busy making other plans.",
      "Get busy living or get busy dying.",
      "The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it.",
      // Technical quotes
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      "First, solve the problem. Then, write the code.",
      "Experience is the name everyone gives to their mistakes.",
      "In order to be irreplaceable, one must always be different.",
      "Java is to JavaScript what car is to Carpet.",
      "Programs must be written for people to read, and only incidentally for machines to execute.",
      "The best error message is the one that never shows up.",
      "Debugging is twice as hard as writing the code in the first place.",
      "Code is like humor. When you have to explain it, it's bad.",
      "Programming isn't about what you know; it's about what you can figure out."
    ]
  },
  french: {
    words: [
      // Most common 200 French words
      'le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son',
      'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'comme', 'mais', 'on', 'faire', 'par', 'je', 'du', 'au',
      'grand', 'temps', 'homme', 'jour', 'chose', 'vie', 'voir', 'bien', 'sans', 'deux', 'autre', 'même', 'après',
      'savoir', 'devoir', 'elle', 'vouloir', 'pouvoir', 'dire', 'quoi', 'aller', 'venir', 'leur', 'nous', 'vous',
      'mon', 'tout', 'celui', 'celui-ci', 'celui-là', 'cela', 'ceci', 'ça', 'alors', 'aussi', 'encore', 'déjà',
      'là', 'ici', 'où', 'quand', 'comment', 'pourquoi', 'combien', 'beaucoup', 'peu', 'plus', 'moins', 'très',
      'trop', 'assez', 'plutôt', 'vraiment', 'peut-être', 'sûrement', 'certainement', 'probablement', 'jamais',
      'toujours', 'souvent', 'parfois', 'quelquefois', 'rarement', 'aujourd\'hui', 'hier', 'demain', 'maintenant',
      'bientôt', 'tard', 'tôt', 'longtemps', 'moment', 'instant', 'seconde', 'minute', 'heure', 'matin', 'soir',
      'nuit', 'semaine', 'mois', 'année', 'siècle', 'monde', 'pays', 'ville', 'maison', 'famille', 'enfant',
      'père', 'mère', 'fils', 'fille', 'frère', 'sœur', 'mari', 'femme', 'ami', 'amour', 'cœur', 'main', 'œil',
      'tête', 'corps', 'eau', 'feu', 'terre', 'air', 'soleil', 'lune', 'étoile', 'mer', 'montagne', 'arbre',
      'fleur', 'couleur', 'blanc', 'noir', 'rouge', 'bleu', 'vert', 'jaune', 'beau', 'joli', 'bon', 'mauvais',
      'petit', 'gros', 'haut', 'bas', 'long', 'court', 'large', 'étroit', 'nouveau', 'vieux', 'jeune', 'vrai',
      'faux', 'simple', 'difficile', 'facile', 'important', 'possible', 'impossible', 'premier', 'dernier',
      // Additional 50 common French words (151-200)
      'prendre', 'donner', 'mettre', 'partir', 'sortir', 'arriver', 'entrer', 'rester', 'tomber', 'porter',
      'trouver', 'garder', 'laisser', 'suivre', 'montrer', 'jouer', 'gagner', 'perdre', 'finir', 'commencer',
      'continuer', 'arrêter', 'changer', 'passer', 'tourner', 'ouvrir', 'fermer', 'acheter', 'vendre', 'payer',
      'coûter', 'valoir', 'servir', 'utiliser', 'employer', 'travailler', 'étudier', 'apprendre', 'enseigner', 'expliquer',
      'comprendre', 'écouter', 'entendre', 'parler', 'répondre', 'demander', 'question', 'réponse', 'problème', 'solution'
    ],
    quotes: [
      "La vie est ce qui vous arrive pendant que vous faites d'autres projets.",
      "Il n'y a qu'un bonheur dans la vie, c'est d'aimer et d'être aimé.",
      "L'imagination est plus importante que le savoir.",
      "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.",
      "Chaque enfant qu'on enseigne est un homme qu'on gagne.",
      "La vraie générosité envers l'avenir consiste à tout donner au présent.",
      "Il faut toujours viser la lune, car même en cas d'échec, on atterrit dans les étoiles.",
      "Le bonheur n'est pas une destination, c'est une façon de voyager.",
      "Hier est derrière, demain est mystère, et aujourd'hui est un cadeau.",
      "La patience est l'art d'espérer.",
      "Ce qui ne nous tue pas nous rend plus forts.",
      "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde.",
      "Il vaut mieux allumer une bougie que de maudire l'obscurité.",
      "La culture, c'est ce qui reste quand on a tout oublié.",
      "Un voyage de mille lieues commence toujours par un premier pas.",
      "La beauté est dans l'œil de celui qui regarde.",
      "Mieux vaut tard que jamais.",
      "Qui vivra verra.",
      "L'habit ne fait pas le moine.",
      "Tout vient à point à qui sait attendre.",
      // Technical French quotes
      "function calculer(nombre) { return nombre * 2; }",
      "const résultat = données.map(item => item.valeur).filter(val => val > 0);",
      "Je pense, donc je suis. - René Descartes",
      "La programmation est l'art de dire à un autre humain ce que l'on veut qu'un ordinateur fasse."
    ]
  },
  spanish: {
    words: [
      // Most common 200 Spanish words
      'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por',
      'son', 'con', 'para', 'al', 'una', 'del', 'todo', 'pero', 'más', 'hacer', 'muy', 'puede', 'tiempo',
      'casa', 'año', 'estado', 'parte', 'mundo', 'vida', 'mano', 'día', 'trabajo', 'hombre', 'mujer',
      'ir', 'tener', 'estar', 'hasta', 'sin', 'sobre', 'vez', 'tanto', 'durante', 'mientras', 'después',
      'antes', 'siempre', 'nunca', 'hoy', 'ayer', 'mañana', 'ahora', 'aquí', 'allí', 'donde', 'cuando',
      'como', 'qué', 'quién', 'cual', 'cuanto', 'porque', 'sino', 'aunque', 'si', 'cada', 'otro', 'mismo',
      'primero', 'último', 'segundo', 'tercero', 'mejor', 'peor', 'mayor', 'menor', 'grande', 'pequeño',
      'nuevo', 'viejo', 'bueno', 'malo', 'bonito', 'feo', 'alto', 'bajo', 'largo', 'corto', 'ancho', 'estrecho',
      'blanco', 'negro', 'rojo', 'azul', 'verde', 'amarillo', 'rosa', 'gris', 'marrón', 'naranja', 'morado',
      'padre', 'madre', 'hijo', 'hija', 'hermano', 'hermana', 'abuelo', 'abuela', 'nieto', 'nieta', 'marido',
      'esposa', 'amigo', 'amiga', 'familia', 'gente', 'persona', 'niño', 'niña', 'adulto', 'joven', 'viejo',
      'agua', 'fuego', 'tierra', 'aire', 'sol', 'luna', 'estrella', 'cielo', 'mar', 'océano', 'río', 'lago',
      'montaña', 'valle', 'bosque', 'árbol', 'flor', 'planta', 'animal', 'perro', 'gato', 'pájaro', 'pez',
      'comer', 'beber', 'dormir', 'caminar', 'correr', 'saltar', 'volar', 'nadar', 'leer', 'escribir', 'hablar',
      'escuchar', 'ver', 'mirar', 'pensar', 'saber', 'conocer', 'aprender', 'enseñar', 'trabajar', 'jugar',
      'amor', 'paz', 'guerra', 'felicidad', 'tristeza', 'alegría', 'dolor', 'salud', 'enfermedad', 'dinero',
      // Additional 50 common Spanish words (151-200)
      'comprar', 'vender', 'pagar', 'costar', 'llevar', 'traer', 'dar', 'recibir', 'tomar', 'dejar',
      'encontrar', 'buscar', 'perder', 'ganar', 'empezar', 'terminar', 'seguir', 'parar', 'continuar', 'cambiar',
      'abrir', 'cerrar', 'entrar', 'salir', 'llegar', 'irse', 'volver', 'regresar', 'quedar', 'vivir',
      'morir', 'nacer', 'crecer', 'estudiar', 'enseñar', 'explicar', 'preguntar', 'responder', 'llamar', 'decir',
      'contar', 'recordar', 'olvidar', 'sentir', 'tocar', 'oler', 'probar', 'gustar', 'querer', 'necesitar'
    ],
    quotes: [
      "La vida es aquello que te va sucediendo mientras te empeñas en hacer otros planes.",
      "No hay camino para la paz, la paz es el camino.",
      "El futuro pertenece a quienes creen en la belleza de sus sueños.",
      "No es más rico quien más tiene, sino quien menos necesita.",
      "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
      "Elige un trabajo que ames y no tendrás que trabajar ni un día de tu vida.",
      "El único modo de hacer un gran trabajo es amar lo que haces.",
      "La imaginación es más importante que el conocimiento.",
      "Hay dos cosas infinitas: el universo y la estupidez humana; y no estoy seguro del universo.",
      "No juzgues cada día por la cosecha que obtienes, sino por las semillas que plantas.",
      "La mejor venganza es no ser como tu enemigo.",
      "Si puedes soñarlo, puedes lograrlo.",
      "La vida es como montar en bicicleta, para mantener el equilibrio debes seguir moviéndote.",
      "Todos tenemos sueños, pero para hacer realidad los sueños hace falta mucha determinación.",
      "El éxito no es final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
      "No esperes por el momento perfecto, toma el momento y hazlo perfecto.",
      "La diferencia entre lo ordinario y lo extraordinario es esa pequeña palabra 'extra'.",
      "Cree en ti mismo y todo será posible.",
      "La perseverancia es la clave del éxito.",
      "Haz de cada día tu obra maestra.",
      // Technical Spanish quotes
      "function calcular(numero) { return numero * 2; }",
      "const resultado = datos.map(item => item.valor).filter(val => val > 0);",
      "La programación es el arte de decirle a otro humano lo que quieres que haga una computadora.",
      "El código limpio siempre parece que fue escrito por alguien que se preocupa por él."
    ]
  },
  german: {
    words: [
      // Most common 200 German words
      'der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'im',
      'dem', 'nicht', 'ein', 'eine', 'als', 'auch', 'es', 'an', 'werden', 'aus', 'er', 'hat', 'dass',
      'sie', 'nach', 'wird', 'bei', 'einer', 'um', 'am', 'sind', 'noch', 'wie', 'einem', 'über', 'einen',
      'ich', 'du', 'wir', 'ihr', 'mich', 'dich', 'uns', 'euch', 'ihm', 'ihn', 'ihnen', 'sein', 'ihr', 'mein',
      'dein', 'unser', 'euer', 'haben', 'sein', 'werden', 'können', 'müssen', 'sollen', 'wollen', 'dürfen',
      'mögen', 'kommen', 'gehen', 'stehen', 'liegen', 'sitzen', 'laufen', 'fahren', 'fliegen', 'schwimmen',
      'sehen', 'hören', 'sprechen', 'sagen', 'fragen', 'antworten', 'verstehen', 'wissen', 'lernen', 'lehren',
      'arbeiten', 'spielen', 'schlafen', 'essen', 'trinken', 'kochen', 'kaufen', 'verkaufen', 'bezahlen', 'kosten',
      'leben', 'sterben', 'geboren', 'jung', 'alt', 'neu', 'gut', 'schlecht', 'schön', 'hässlich', 'groß',
      'klein', 'lang', 'kurz', 'breit', 'schmal', 'hoch', 'niedrig', 'schwer', 'leicht', 'stark', 'schwach',
      'schnell', 'langsam', 'warm', 'kalt', 'heiß', 'kühl', 'hell', 'dunkel', 'weiß', 'schwarz', 'rot',
      'blau', 'grün', 'gelb', 'braun', 'rosa', 'grau', 'orange', 'lila', 'viel', 'wenig', 'alle', 'einige',
      'heute', 'gestern', 'morgen', 'jetzt', 'später', 'früh', 'spät', 'immer', 'nie', 'oft', 'manchmal',
      'hier', 'da', 'dort', 'wo', 'wohin', 'woher', 'wann', 'warum', 'wie', 'was', 'wer', 'wen', 'wem', 'wessen',
      'haus', 'wohnung', 'zimmer', 'küche', 'bad', 'garten', 'straße', 'stadt', 'land', 'berg', 'meer',
      'familie', 'mutter', 'vater', 'kind', 'sohn', 'tochter', 'bruder', 'schwester', 'großmutter', 'großvater',
      // Additional 50 common German words (151-200)
      'nehmen', 'geben', 'setzen', 'legen', 'stellen', 'bringen', 'holen', 'finden', 'suchen', 'zeigen',
      'machen', 'tun', 'lassen', 'bleiben', 'beginnen', 'aufhören', 'denken', 'glauben', 'meinen', 'hoffen',
      'wünschen', 'lieben', 'hassen', 'fühlen', 'empfinden', 'schauen', 'blicken', 'betrachten', 'beobachten', 'erkennen',
      'entdecken', 'erfinden', 'erschaffen', 'bauen', 'erstellen', 'produzieren', 'herstellen', 'entwickeln', 'verändern', 'verbessern',
      'reparieren', 'zerstören', 'kaputt', 'ganz', 'halb', 'teil', 'stück', 'ganzes', 'nichts', 'etwas'
    ],
    quotes: [
      "Das Leben ist das, was passiert, während du eifrig dabei bist, andere Pläne zu machen.",
      "Die Phantasie ist wichtiger als das Wissen.",
      "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
      "Das Glück ist das einzige, was sich verdoppelt, wenn man es teilt.",
      "Bildung ist das, was übrig bleibt, wenn man alles vergessen hat, was man in der Schule gelernt hat.",
      "Man sollte nie so viel zu tun haben, dass man zum Nachdenken keine Zeit mehr hat.",
      "Der Weg ist das Ziel.",
      "Was uns nicht umbringt, macht uns stärker.",
      "Alles hat ein Ende, nur die Wurst hat zwei.",
      "Aller Anfang ist schwer.",
      "Der frühe Vogel fängt den Wurm.",
      "Wer rastet, der rostet.",
      "Ohne Fleiß kein Preis.",
      "Viele Köche verderben den Brei.",
      "Wer zuletzt lacht, lacht am besten.",
      "Was du heute kannst besorgen, das verschiebe nicht auf morgen.",
      "Morgenstund hat Gold im Mund.",
      "Aller guten Dinge sind drei.",
      "Lieber den Spatz in der Hand als die Taube auf dem Dach.",
      "Wer nicht wagt, der nicht gewinnt.",
      "Einmal ist keinmal.",
      "Wo gehobelt wird, da fallen Späne.",
      "Wer A sagt, muss auch B sagen.",
      "In der Kürze liegt die Würze.",
      // Technical German quotes
      "function berechnen(zahl) { return zahl * 2; }",
      "const ergebnis = daten.map(element => element.wert).filter(wert => wert > 0);",
      "Programmierung ist die Kunst, einem anderen Menschen zu sagen, was ein Computer tun soll.",
      "Sauberer Code sieht immer so aus, als wäre er von jemandem geschrieben worden, dem er wichtig ist."
    ]
  },
  javascript: {
    words: [
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'null', 'undefined',
      'this', 'new', 'class', 'constructor', 'extends', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
      'typeof', 'instanceof', 'delete', 'void', 'in', 'of', 'with', 'break', 'continue', 'switch', 'case', 'default'
    ],
    quotes: [
      "const result = array.map(item => item.value).filter(value => value > 0);",
      "async function fetchData() { const response = await fetch('/api/data'); return response.json(); }",
      "class Component extends React.Component { constructor(props) { super(props); } }",
      "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func(...args), delay); }; };"
    ]
  },
  python: {
    words: [
      'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False',
      'import', 'from', 'as', 'with', 'try', 'except', 'finally', 'raise', 'return', 'yield', 'pass', 'break', 'continue'
    ],
    quotes: [
      "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
      "import numpy as np; import pandas as pd; import matplotlib.pyplot as plt",
      "class Person: def __init__(self, name, age): self.name = name; self.age = age"
    ]
  },
  typescript: {
    words: [
      'interface', 'type', 'class', 'function', 'const', 'let', 'var', 'public', 'private', 'protected', 'readonly',
      'static', 'abstract', 'implements', 'extends', 'generic', 'namespace', 'module', 'declare', 'enum'
    ],
    quotes: [
      "interface User { id: number; name: string; email?: string; }",
      "type ApiResponse<T> = { data: T; status: number; message: string; }",
      "const getUserById = async (id: number): Promise<User | null> => { return await userService.findById(id); }"
    ]
  },
  java: {
    words: [
      'public', 'private', 'protected', 'class', 'interface', 'abstract', 'static', 'final', 'void', 'int', 'String',
      'boolean', 'double', 'float', 'long', 'char', 'byte', 'short', 'new', 'this', 'super', 'extends', 'implements'
    ],
    quotes: [
      "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }",
      "List<String> names = Arrays.asList(\"Alice\", \"Bob\", \"Charlie\");",
      "Optional<User> user = userRepository.findById(userId).orElse(null);"
    ]
  },
  cpp: {
    words: [
      'int', 'char', 'float', 'double', 'bool', 'void', 'class', 'struct', 'public', 'private', 'protected',
      'virtual', 'static', 'const', 'inline', 'template', 'typename', 'namespace', 'using', 'include'
    ],
    quotes: [
      "#include <iostream> using namespace std; int main() { cout << \"Hello World\" << endl; return 0; }",
      "template<typename T> class SmartPointer { private: T* ptr; public: explicit SmartPointer(T* p) : ptr(p) {} };",
      "std::vector<int> numbers = {1, 2, 3, 4, 5}; std::sort(numbers.begin(), numbers.end());"
    ]
  },
  rust: {
    words: [
      'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait', 'for', 'in', 'while', 'loop',
      'if', 'else', 'match', 'Some', 'None', 'Ok', 'Err', 'pub', 'mod', 'use', 'crate', 'self', 'super'
    ],
    quotes: [
      "fn main() { println!(\"Hello, world!\"); }",
      "let numbers: Vec<i32> = vec![1, 2, 3, 4, 5]; let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();",
      "match result { Ok(value) => println!(\"Success: {}\", value), Err(error) => eprintln!(\"Error: {}\", error), }"
    ]
  },
  go: {
    words: [
      'func', 'var', 'const', 'type', 'struct', 'interface', 'package', 'import', 'for', 'range', 'if', 'else',
      'switch', 'case', 'default', 'go', 'chan', 'select', 'defer', 'return', 'break', 'continue'
    ],
    quotes: [
      "package main; import \"fmt\"; func main() { fmt.Println(\"Hello, World!\") }",
      "type User struct { ID int `json:\"id\"`; Name string `json:\"name\"`; Email string `json:\"email\"` }",
      "go func() { for range time.Tick(time.Second) { fmt.Println(\"Tick\") } }()"
    ]
  },
  html: {
    words: [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'a', 'img', 'ul', 'li', 'ol', 'table', 'tr', 'td', 'th',
      'form', 'input', 'button', 'select', 'option', 'textarea', 'label', 'head', 'body', 'html', 'meta'
    ],
    quotes: [
      "<div class=\"container\"><h1>Welcome to Our Website</h1><p>This is a paragraph.</p></div>",
      "<form action=\"/submit\" method=\"POST\"><input type=\"text\" name=\"username\" required><button type=\"submit\">Submit</button></form>",
      "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Document</title></head><body></body></html>"
    ]
  },
  css: {
    words: [
      'display', 'flex', 'grid', 'position', 'absolute', 'relative', 'fixed', 'color', 'background', 'border',
      'margin', 'padding', 'width', 'height', 'font', 'size', 'weight', 'family', 'text', 'align', 'center'
    ],
    quotes: [
      ".container { display: flex; justify-content: center; align-items: center; height: 100vh; }",
      "@media (max-width: 768px) { .sidebar { display: none; } .main-content { width: 100%; } }",
      ".button { background: linear-gradient(45deg, #6366f1, #8b5cf6); border-radius: 8px; padding: 12px 24px; }"
    ]
  },
  php: {
    words: [
      'function', 'class', 'public', 'private', 'protected', 'static', 'abstract', 'interface', 'namespace',
      'use', 'include', 'require', 'echo', 'print', 'var', 'array', 'foreach', 'while', 'for', 'if', 'else'
    ],
    quotes: [
      "<?php function calculateSum($array) { return array_sum($array); } ?>",
      "class User { private $name; public function __construct($name) { $this->name = $name; } }",
      "foreach ($users as $user) { echo $user->getName(); }"
    ]
  },
  csharp: {
    words: [
      'public', 'private', 'protected', 'class', 'interface', 'abstract', 'static', 'virtual', 'override',
      'string', 'int', 'bool', 'double', 'float', 'var', 'using', 'namespace', 'void', 'return', 'new'
    ],
    quotes: [
      "public class Program { public static void Main(string[] args) { Console.WriteLine(\"Hello World!\"); } }",
      "public interface IRepository<T> { Task<T> GetByIdAsync(int id); Task<IEnumerable<T>> GetAllAsync(); }",
      "var users = await _userService.GetUsersAsync().Where(u => u.IsActive).ToListAsync();"
    ]
  }
};

const MonkeyTypeTest: React.FC = () => {
  // Core state
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [language, setLanguage] = useState<TestLanguage>('english');
  const [difficulty] = useState<TestDifficulty>('normal');
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordCount, setWordCount] = useState(50);
  const [isExtremeMode, setIsExtremeMode] = useState(false);
  const [isTapeMode, setIsTapeMode] = useState(false);
  const [spaceDisplay, setSpaceDisplay] = useState<'space' | 'underscore' | 'dot'>('dot');
  const [speedMetric, setSpeedMetric] = useState<SpeedMetric>('wpm');
  const [restartKey, setRestartKey] = useState<'enter' | 'tab'>('enter');
  const [customLayout, setCustomLayout] = useState<any>(null);
  
  // Test state
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testFailed, setTestFailed] = useState(false);
  
  // Advanced tracking
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [keyStats, setKeyStats] = useState<Record<string, { correct: number; incorrect: number }>>({});
  const [fingerStats, setFingerStats] = useState<Record<string, { correct: number; incorrect: number; weakness: boolean }>>({});
  const [missedWords, setMissedWords] = useState<Set<string>>(new Set());
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState<'test' | 'stats' | 'history'>('test');
  
  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('monkeytype-profile');
    return saved ? JSON.parse(saved) : {
      totalTests: 0,
      totalTimeSpent: 0,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
      testHistory: [],
      weakFingers: [],
      weakKeys: [],
      mostMissedWords: [],
      currentStreak: 0,
      longestStreak: 0
    };
  });
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Finger mapping for analysis
  const fingerMap: Record<string, string> = {
    'q': 'LP', 'w': 'LR', 'e': 'LM', 'r': 'LI', 't': 'LI', 'y': 'RI', 'u': 'RI', 'i': 'RM', 'o': 'RR', 'p': 'RP',
    'a': 'LP', 's': 'LR', 'd': 'LM', 'f': 'LI', 'g': 'LI', 'h': 'RI', 'j': 'RI', 'k': 'RM', 'l': 'RR', ';': 'RP',
    'z': 'LP', 'x': 'LR', 'c': 'LM', 'v': 'LI', 'b': 'LI', 'n': 'RI', 'm': 'RI', ',': 'RM', '.': 'RR', '/': 'RP',
    ' ': 'LT'
  };

  // Create keyboard input remapping for custom layouts
  const createInputRemapping = useCallback(() => {
    if (!customLayout?.layout?.keys) return null;
    
    const remapping: Record<string, string> = {};
    const qwertyPositions = {
      '`': '`', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '-': '-', '=': '=',
      'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't', 'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p', '[': '[', ']': ']',
      'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', ';': ';', "'": "'",
      'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b', 'n': 'n', 'm': 'm', ',': ',', '.': '.', '/': '/'
    };
    
    // Map QWERTY physical keys to custom layout characters
    Object.entries(qwertyPositions).forEach(([qwertyKey, qwertyPos]) => {
      if (customLayout.layout.keys[qwertyPos]) {
        remapping[qwertyKey] = customLayout.layout.keys[qwertyPos];
      }
    });
    
    return remapping;
  }, [customLayout]);

  // Get the input remapping
  const inputRemapping = createInputRemapping();

  // Check if language is a programming language
  const isProgrammingLanguage = (lang: TestLanguage): boolean => {
    return ['javascript', 'python', 'typescript', 'java', 'cpp', 'rust', 'go', 'html', 'css', 'php', 'csharp'].includes(lang);
  };

  // Generate text based on mode and language using analysis engine
  const generateText = useCallback(() => {
    // Start with synchronous fallback content
    const getFallbackText = () => {
      const content = languageContent[language];
      if (content) {
        if (testMode === 'quote') {
          return content.quotes[Math.floor(Math.random() * content.quotes.length)];
        }
        
        // For programming languages, use actual code snippets instead of individual words
        if (isProgrammingLanguage(language)) {
          const targetLines = testMode === 'words' ? Math.max(3, Math.ceil(wordCount / 10)) : 5;
          const selectedLines: string[] = [];
          
          for (let i = 0; i < targetLines; i++) {
            selectedLines.push(content.quotes[Math.floor(Math.random() * content.quotes.length)]);
          }
          
          return selectedLines.join(' ');
        }
        
        // For natural languages, use individual words
        const words = content.words;
        const selectedWords: string[] = [];
        const targetWordCount = testMode === 'words' ? wordCount : Math.max(50, wordCount);

        for (let i = 0; i < targetWordCount; i++) {
          selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }

        return selectedWords.join(' ');
      }
      return 'the quick brown fox jumps over the lazy dog typing test fallback content';
    };
    
    // Return synchronous fallback for now - we can add async enhancement later
    return getFallbackText();
  }, [language, testMode, wordCount]);

  // Reset test
  const resetTest = useCallback(() => {
    const newText = generateText();
    setCurrentText(newText);
    setUserInput('');
    setCurrentIndex(0);
    setIsTyping(false);
    setTimeLeft(timeLimit);
    setWordsTyped(0);
    setErrors(0);
    setShowResults(false);
    setTestFailed(false);
    setWpmHistory([]);
    setKeyStats({});
    setFingerStats({});
    setMissedWords(new Set());
    startTimeRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [generateText, timeLimit]);

  // Check for custom layout on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('layout') === 'custom') {
      const storedLayout = sessionStorage.getItem('testLayout');
      if (storedLayout) {
        try {
          const layoutData = JSON.parse(storedLayout);
          setCustomLayout(layoutData);
          setTestMode('custom');
          // Ensure layout tester defaults to 30-second time mode
          setTimeLimit(30);
        } catch (error) {
          console.error('Error loading custom layout:', error);
        }
      }
    }
  }, []);

  // Initialize test
  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    if (!isTyping || startTimeRef.current === 0) return 0;
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const correctChars = userInput.length - errors;
    return Math.round((correctChars / 5) / timeElapsed);
  }, [isTyping, userInput.length, errors]);

  // Calculate Raw WPM (including errors)
  const calculateRawWPM = useCallback(() => {
    if (!isTyping || startTimeRef.current === 0) return 0;
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    return Math.round((userInput.length / 5) / timeElapsed);
  }, [isTyping, userInput.length]);

  // Calculate CPM (Characters Per Minute)
  const calculateCPM = useCallback(() => {
    if (!isTyping || startTimeRef.current === 0) return 0;
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const correctChars = userInput.length - errors;
    return Math.round(correctChars / timeElapsed);
  }, [isTyping, userInput.length, errors]);

  // Calculate CPS (Characters Per Second)
  const calculateCPS = useCallback(() => {
    if (!isTyping || startTimeRef.current === 0) return 0;
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
    const correctChars = userInput.length - errors;
    return Math.round((correctChars / timeElapsed) * 10) / 10; // One decimal place
  }, [isTyping, userInput.length, errors]);

  // Calculate WPS (Words Per Second)
  const calculateWPS = useCallback(() => {
    if (!isTyping || startTimeRef.current === 0) return 0;
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
    const correctChars = userInput.length - errors;
    const words = correctChars / 5;
    return Math.round((words / timeElapsed) * 10) / 10; // One decimal place
  }, [isTyping, userInput.length, errors]);

  // Get current speed value based on selected metric
  const getCurrentSpeed = useCallback(() => {
    switch (speedMetric) {
      case 'wpm': return calculateWPM();
      case 'cpm': return calculateCPM();
      case 'cps': return calculateCPS();
      case 'wps': return calculateWPS();
      default: return calculateWPM();
    }
  }, [speedMetric, calculateWPM, calculateCPM, calculateCPS, calculateWPS]);

  // Get final speed value for test results based on selected metric
  const getFinalSpeed = useCallback(() => {
    const testDuration = (testMode === 'time' || testMode === 'custom') ? timeLimit : (Date.now() - startTimeRef.current) / 1000;
    const correctChars = userInput.length - errors;
    
    switch (speedMetric) {
      case 'wpm': return Math.round((correctChars / 5) / (testDuration / 60));
      case 'cpm': return Math.round(correctChars / (testDuration / 60));
      case 'cps': return Math.round((correctChars / testDuration) * 10) / 10;
      case 'wps': return Math.round(((correctChars / 5) / testDuration) * 10) / 10;
      default: return Math.round((correctChars / 5) / (testDuration / 60));
    }
  }, [speedMetric, testMode, timeLimit, userInput.length, errors]);

  // Update WPM history
  useEffect(() => {
    if (isTyping && !showResults && !testFailed) {
      wpmTimerRef.current = setInterval(() => {
        const currentWpm = calculateWPM();
        setWpmHistory(prev => [...prev, currentWpm]);
      }, 1000);
    } else if (wpmTimerRef.current) {
      clearInterval(wpmTimerRef.current);
    }

    return () => {
      if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    };
  }, [isTyping, showResults, testFailed, calculateWPM]);

  // Timer countdown
  useEffect(() => {
    if (isTyping && timeLeft > 0 && (testMode === 'time' || testMode === 'custom') && !testFailed) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTyping, timeLeft, testMode, testFailed]);

  // End test
  const endTest = useCallback(() => {
    setIsTyping(false);
    setShowResults(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);

    // Calculate final stats
    const testDuration = (testMode === 'time' || testMode === 'custom') ? timeLimit : (Date.now() - startTimeRef.current) / 1000;
    const correctChars = userInput.length - errors;
    const accuracy = Math.round((correctChars / userInput.length) * 100);
    const wpm = calculateWPM();
    const rawWpm = calculateRawWPM();

    // Calculate consistency
    const wpmMean = wpmHistory.reduce((sum, w) => sum + w, 0) / wpmHistory.length;
    const wpmVariance = wpmHistory.reduce((sum, w) => sum + Math.pow(w - wpmMean, 2), 0) / wpmHistory.length;
    const consistency = Math.max(0, 100 - Math.round((Math.sqrt(wpmVariance) / wpmMean) * 100)) || 0;

    // Create test stats
    const testStats: TestStats = {
      wpm,
      rawWpm,
      accuracy,
      consistency,
      correctChars,
      incorrectChars: errors,
      missedChars: 0,
      extraChars: 0,
      keyStats,
      fingerStats,
      weakKeys: Object.entries(keyStats).filter(([, stats]) => stats.incorrect > stats.correct * 0.1).map(([key]) => key),
      mostMissedWords: Array.from(missedWords),
      testDuration,
      timestamp: Date.now(),
      language,
      mode: testMode,
      difficulty
    };

    // Update user profile
    const newProfile: UserProfile = {
      ...userProfile,
      totalTests: userProfile.totalTests + 1,
      totalTimeSpent: userProfile.totalTimeSpent + testDuration,
      averageWpm: Math.round(((userProfile.averageWpm * userProfile.totalTests) + wpm) / (userProfile.totalTests + 1)),
      bestWpm: Math.max(userProfile.bestWpm, wpm),
      averageAccuracy: Math.round(((userProfile.averageAccuracy * userProfile.totalTests) + accuracy) / (userProfile.totalTests + 1)),
      testHistory: [...userProfile.testHistory, testStats].slice(-100), // Keep last 100 tests
      currentStreak: accuracy >= 95 ? userProfile.currentStreak + 1 : 0,
      longestStreak: Math.max(userProfile.longestStreak, accuracy >= 95 ? userProfile.currentStreak + 1 : 0)
    };

    setUserProfile(newProfile);
    localStorage.setItem('monkeytype-profile', JSON.stringify(newProfile));
  }, [userInput, errors, timeLimit, testMode, calculateWPM, calculateRawWPM, wpmHistory, keyStats, fingerStats, missedWords, language, difficulty, userProfile]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const currentTime = Date.now();

    // Apply custom layout input remapping
    if (inputRemapping && customLayout && testMode === 'custom') {
      // Remap the last typed character if it's a new character
      if (value.length > userInput.length) {
        const lastTypedChar = value[value.length - 1];
        const remappedChar = inputRemapping[lastTypedChar.toLowerCase()];
        if (remappedChar) {
          value = userInput + remappedChar;
        }
      }
    }

    // Start test on first keystroke
    if (!isTyping && value.length === 1) {
      setIsTyping(true);
      startTimeRef.current = currentTime;
    }

    // Prevent typing beyond text length
    if (value.length > currentText.length) return;

    // Check for mistakes in extreme mode
    if (isExtremeMode && value.length > 0) {
      const lastChar = value[value.length - 1];
      const expectedChar = currentText[value.length - 1];
      if (lastChar !== expectedChar) {
        setTestFailed(true);
        setIsTyping(false);
        return;
      }
    }

    setUserInput(value);
    setCurrentIndex(value.length);

    // Count errors and track key stats
    let errorCount = 0;
    const newKeyStats = { ...keyStats };
    const newFingerStats = { ...fingerStats };

    for (let i = 0; i < value.length; i++) {
      const typedChar = value[i];
      const expectedChar = currentText[i];
      const finger = fingerMap[typedChar.toLowerCase()] || 'Unknown';

      // Initialize stats if not exist
      if (!newKeyStats[typedChar]) {
        newKeyStats[typedChar] = { correct: 0, incorrect: 0 };
      }
      if (!newFingerStats[finger]) {
        newFingerStats[finger] = { correct: 0, incorrect: 0, weakness: false };
      }

      if (typedChar === expectedChar) {
        newKeyStats[typedChar].correct++;
        newFingerStats[finger].correct++;
      } else {
        newKeyStats[typedChar].incorrect++;
        newFingerStats[finger].incorrect++;
        errorCount++;
      }
    }

    setErrors(errorCount);
    setKeyStats(newKeyStats);
    setFingerStats(newFingerStats);

    // Count words and track missed words
    const words = value.trim().split(' ');
    setWordsTyped(words.length);

    // Check if test is complete
    if (value.length === currentText.length || (testMode === 'words' && wordsTyped >= wordCount)) {
      endTest();
    }

    // Scroll text in tape mode
    if (isTapeMode && textContainerRef.current) {
      const charWidth = 12; // Approximate character width
      textContainerRef.current.scrollLeft = Math.max(0, (value.length - 30) * charWidth);
    }
  };

  // Handle key press for input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const shouldRestart = (restartKey === 'enter' && e.key === 'Enter') || 
                         (restartKey === 'tab' && e.key === 'Tab');
    
    if (shouldRestart) {
      e.preventDefault();
      resetTest();
    }
    
    if (e.key === 'Escape') {
      setShowSettings(!showSettings);
    }
  };

  // Handle global key press for restart functionality
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    const shouldRestart = (restartKey === 'enter' && e.key === 'Enter') || 
                         (restartKey === 'tab' && e.key === 'Tab');
    
    if (shouldRestart && (showResults || testFailed)) {
      e.preventDefault();
      resetTest();
    }
    
    if (e.key === 'Escape') {
      setShowSettings(!showSettings);
    }
  }, [restartKey, showResults, testFailed, resetTest, showSettings, setShowSettings]);

  // Global keyboard event listener for restart functionality
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

  // Render character
  const renderCharacter = (char: string, index: number) => {
    let className = 'character ';
    
    if (index < userInput.length) {
      className += userInput[index] === char ? 'text-green-400 bg-green-400/20 ' : 'text-red-400 bg-red-400/20 ';
    } else if (index === currentIndex) {
      className += 'bg-purple-500/50 ';
    } else {
      className += 'text-gray-500 ';
    }

    const displayChar = char === ' ' 
      ? spaceDisplay === 'space' 
        ? ' '
        : spaceDisplay === 'underscore' 
        ? '_' 
        : '·'
      : char;

    return (
      <span key={index} className={className}>
        {displayChar}
      </span>
    );
  };

  // Download test history
  const downloadHistory = () => {
    const dataStr = JSON.stringify(userProfile.testHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'typingod-history.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Current stats for display
  const currentAccuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono overflow-hidden relative">
      {/* Header - Different for each page */}
      {currentPage === 'test' ? (
        // Minimal header for typing test
        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Keyboard className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1">typingod</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500">
              tests: {userProfile.totalTests} | best: {userProfile.bestWpm}wpm
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Full header for stats/history pages
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Keyboard className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1">typingod</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCurrentPage('test');
                  // Clear custom layout when navigating to regular test
                  if (testMode === 'custom') {
                    setCustomLayout(null);
                    setTestMode('time');
                    setTimeLimit(30);
                    resetTest();
                  }
                }}
                className="px-4 py-2 rounded transition-all hover:bg-gray-800"
              >
                test
              </button>
              <button
                onClick={() => setCurrentPage('stats')}
                className={`px-4 py-2 rounded transition-all ${currentPage === 'stats' ? 'bg-purple-600' : 'hover:bg-gray-800'}`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                stats
              </button>
              <button
                onClick={() => setCurrentPage('history')}
                className={`px-4 py-2 rounded transition-all ${currentPage === 'history' ? 'bg-purple-600' : 'hover:bg-gray-800'}`}
              >
                <History className="w-4 h-4 inline mr-2" />
                history
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              tests: {userProfile.totalTests} | avg: {userProfile.averageWpm}wpm
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Test Page */}
      {currentPage === 'test' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto">
              {/* Settings Panel */}
              {showSettings && (
                <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 gradient-text">settings</h3>
              
              {/* Test Mode */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">test mode</label>
                <div className="flex gap-2">
                  {(['time', 'words', 'quote'] as TestMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => { setTestMode(mode); resetTest(); }}
                      className={`px-4 py-2 rounded transition-all ${testMode === mode ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Metric */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">speed metric</label>
                <div className="flex gap-2">
                  {(['wpm', 'cpm', 'cps', 'wps'] as SpeedMetric[]).map(metric => (
                    <button
                      key={metric}
                      onClick={() => setSpeedMetric(metric)}
                      className={`px-3 py-1 rounded transition-all ${speedMetric === metric ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">language</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value as TestLanguage); resetTest(); }}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 hover:border-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <optgroup label="📝 natural languages" className="bg-gray-800">
                      <option value="english" className="py-2">🇺🇸 english</option>
                      <option value="french" className="py-2">🇫🇷 french</option>
                      <option value="spanish" className="py-2">🇪🇸 spanish</option>
                      <option value="german" className="py-2">🇩🇪 german</option>
                    </optgroup>
                    <optgroup label="💻 programming languages" className="bg-gray-800">
                      <option value="javascript" className="py-2">🟨 javascript</option>
                      <option value="typescript" className="py-2">🔷 typescript</option>
                      <option value="python" className="py-2">🐍 python</option>
                      <option value="java" className="py-2">☕ java</option>
                      <option value="cpp" className="py-2">⚡ c++</option>
                      <option value="csharp" className="py-2">💜 c#</option>
                      <option value="rust" className="py-2">🦀 rust</option>
                      <option value="go" className="py-2">🐹 go</option>
                      <option value="php" className="py-2">🐘 php</option>
                      <option value="html" className="py-2">📄 html</option>
                      <option value="css" className="py-2">🎨 css</option>
                    </optgroup>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {isProgrammingLanguage(language) ? '💡 Uses real code snippets' : '📖 Uses common words'}
                </div>
              </div>

              {/* Time/Word Count */}
              {testMode === 'time' && (
                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">time (seconds)</label>
                  <div className="flex gap-2">
                    {[15, 30, 60, 120, 300].map(time => (
                      <button
                        key={time}
                        onClick={() => { setTimeLimit(time); resetTest(); }}
                        className={`px-3 py-1 rounded transition-all ${timeLimit === time ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {testMode === 'words' && (
                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">word count</label>
                  <div className="flex gap-2">
                    {[10, 25, 50, 100, 200].map(count => (
                      <button
                        key={count}
                        onClick={() => { setWordCount(count); resetTest(); }}
                        className={`px-3 py-1 rounded transition-all ${wordCount === count ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Space Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">space display</label>
                <div className="flex gap-2">
                  {(['space', 'underscore', 'dot'] as const).map(display => (
                    <button
                      key={display}
                      onClick={() => setSpaceDisplay(display)}
                      className={`px-3 py-1 rounded transition-all ${spaceDisplay === display ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      {display === 'space' ? 'space' : display === 'underscore' ? 'underscore _' : 'dot ·'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restart Key Setting */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">restart key</label>
                <div className="flex gap-2">
                  {(['enter', 'tab'] as const).map(key => (
                    <button
                      key={key}
                      onClick={() => setRestartKey(key)}
                      className={`px-3 py-1 rounded transition-all ${restartKey === key ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      {key === 'enter' ? 'enter' : 'tab'}
                    </button>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  press {restartKey === 'enter' ? 'enter' : 'tab'} to restart the test
                </div>
              </div>

              {/* Special Modes */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isExtremeMode}
                    onChange={(e) => { setIsExtremeMode(e.target.checked); resetTest(); }}
                    className="rounded"
                  />
                  <Zap className="w-4 h-4 text-red-400" />
                  extreme mode (one mistake = fail)
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isTapeMode}
                    onChange={(e) => setIsTapeMode(e.target.checked)}
                    className="rounded"
                  />
                  <Hash className="w-4 h-4 text-blue-400" />
                  tape mode
                </label>
              </div>
            </div>
          )}

          {/* Test Failed Message */}
          {testFailed && (
            <div className="text-center mb-6 p-4 bg-red-900/50 rounded-lg border border-red-700">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <h3 className="text-xl font-semibold text-red-400">Test Failed!</h3>
              <p className="text-red-200">You made a mistake in extreme mode. Press {restartKey === 'enter' ? 'Enter' : 'Tab'} to try again.</p>
            </div>
          )}

          {/* Custom Layout Information */}
          {customLayout && testMode === 'custom' && (
            <div className="mb-6">
              <div className="text-center p-4 bg-purple-900/50 rounded-lg border border-purple-700">
                <Keyboard className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <h3 className="text-xl font-semibold text-purple-400">Testing Layout: {customLayout.name}</h3>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    // Clear custom layout and return to regular test
                    setCustomLayout(null);
                    setTestMode('time');
                    setTimeLimit(30);
                    resetTest();
                    // Clear the URL parameter
                    window.history.replaceState({}, '', window.location.pathname);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-sm"
                >
                  ← Back to Regular Test
                </button>
              </div>
            </div>
          )}

          {/* Custom Layout Keyboard Visualization */}
          {customLayout && testMode === 'custom' && (
            <div className="mb-8">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-300">Layout Preview</h4>
              </div>
              <KeyboardVisualization 
                layoutData={customLayout.layout}
                className="max-w-3xl mx-auto"
                showFingerColors={true}
                showLegend={false}
              />
            </div>
          )}

          {/* Text Display */}
          <div className="mb-6">
            <div 
              ref={textContainerRef}
              className={`text-2xl leading-relaxed p-6 bg-gray-800 rounded-lg font-mono select-none ${isTapeMode ? 'overflow-x-auto whitespace-nowrap' : 'break-words'}`}
              style={{ minHeight: '150px', wordBreak: 'break-word', whiteSpace: isTapeMode ? 'nowrap' : 'pre-wrap' }}
            >
              {currentText.split('').map((char, index) => renderCharacter(char, index))}
            </div>
          </div>

          {/* Live Stats - Below Test Text */}
          {isTyping && (
            <div className="flex justify-center gap-8 mb-8 text-xl font-mono">
              <div className="text-center">
                <div className="text-purple-400">{getCurrentSpeed()}</div>
                <div className="text-sm text-gray-500">{speedMetric}</div>
              </div>
              <div className="text-center">
                <div className={currentAccuracy >= 95 ? 'text-green-400' : currentAccuracy >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                  {currentAccuracy}%
                </div>
                <div className="text-sm text-gray-500">acc</div>
              </div>
              {(testMode === 'time' || testMode === 'custom') && (
                <div className="text-center">
                  <div className="text-blue-400">{timeLeft}</div>
                  <div className="text-sm text-gray-500">sec</div>
                </div>
              )}
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none z-[-1]"
            disabled={showResults || testFailed}
            autoFocus
            style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}
          />

          {/* Click to Focus */}
          {!isTyping && !showResults && !testFailed && (
            <div 
              className="text-center py-8 text-gray-400 cursor-pointer"
              onClick={() => inputRef.current?.focus()}
            >
              <p>click here and start typing</p>
              <p className="text-xs mt-2 text-gray-500">Press {restartKey === 'enter' ? 'Enter' : 'Tab'} to restart • Press Escape for settings</p>
              
              {/* Find Your Layout Button - Only show when NOT testing a custom layout */}
              {testMode !== 'custom' && (
                <div className="mt-8">
                  <Link 
                    to="/adaptive-test"
                    className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                  >
                    <Brain className="w-5 h-5" />
                    <span>find your layout</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  </Link>
                  <p className="text-xs mt-3 text-gray-500">adaptive 5-stage test • personalized recommendations</p>
                </div>
              )}
            </div>
          )}

          {/* Test Results */}
          {showResults && (
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-purple-400 mb-2">Test Complete!</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400">{getFinalSpeed()}</div>
                    <div className="text-gray-400">{speedMetric.toUpperCase()}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className={`text-3xl font-bold ${currentAccuracy >= 95 ? 'text-green-400' : currentAccuracy >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {currentAccuracy}%
                    </div>
                    <div className="text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400">{Math.round((userInput.length / 5) / ((testMode === 'time' ? timeLimit : (Date.now() - startTimeRef.current) / 1000) / 60))}</div>
                    <div className="text-gray-400">Raw WPM</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400">
                      {Math.max(0, 100 - Math.round((errors / userInput.length) * 100))}%
                    </div>
                    <div className="text-gray-400">Consistency</div>
                  </div>
                </div>

                <button
                  onClick={resetTest}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Try Again
                </button>
                
                <p className="text-xs mt-4 text-gray-500">Press {restartKey === 'enter' ? 'Enter' : 'Tab'} to restart test</p>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Page */}
      {currentPage === 'stats' && (
        <div className="max-w-6xl mx-auto p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-8">Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{userProfile.totalTests}</div>
              <div className="text-gray-400">Tests Completed</div>
            </div>
            
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(userProfile.totalTimeSpent / 60)}m
              </div>
              <div className="text-gray-400">Time Spent</div>
            </div>
            
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{userProfile.averageWpm}</div>
              <div className="text-gray-400">Average WPM</div>
            </div>
            
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{userProfile.bestWpm}</div>
              <div className="text-gray-400">Best WPM</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tests Chart */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Recent Tests</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {userProfile.testHistory.slice(-10).map((test, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-600 rounded-t"
                      style={{ height: `${(test.wpm / Math.max(...userProfile.testHistory.slice(-10).map(t => t.wpm), 1)) * 200}px` }}
                    />
                    <div className="text-xs text-gray-400 mt-2">{test.wpm}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Areas */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Areas to Improve</h3>
              <div className="space-y-3">
                {userProfile.weakKeys.slice(0, 5).map(key => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-mono bg-gray-700 px-2 py-1 rounded">{key}</span>
                    <span className="text-red-400">Weak key</span>
                  </div>
                ))}
                {userProfile.mostMissedWords.slice(0, 3).map(word => (
                  <div key={word} className="flex justify-between items-center">
                    <span className="font-mono">{word}</span>
                    <span className="text-yellow-400">Missed word</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Page */}
      {currentPage === 'history' && (
        <div className="max-w-6xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-purple-400">Test History</h2>
            <button
              onClick={downloadHistory}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Download History
            </button>
          </div>

          <div className="space-y-4">
            {userProfile.testHistory.slice().reverse().slice(0, 50).map((test, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <div className="text-lg font-semibold text-purple-400">{test.wpm} WPM</div>
                    <div className="text-sm text-gray-400">
                      {new Date(test.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className={`text-lg font-semibold ${test.accuracy >= 95 ? 'text-green-400' : test.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {test.accuracy}%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-400">{test.consistency}%</div>
                    <div className="text-sm text-gray-400">Consistency</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{test.language} • {test.mode}</div>
                  <div className="text-sm text-gray-500">{Math.round(test.testDuration)}s</div>
                </div>
              </div>
            ))}
          </div>

          {userProfile.testHistory.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <History className="w-12 h-12 mx-auto mb-4" />
              <p>No test history yet. Complete some tests to see your progress!</p>
            </div>
          )}
        </div>
      )}
      
      {/* Footer with Credits - Fixed at bottom on test page, hidden when settings are open or testing custom layout */}
      {currentPage === 'test' && !showSettings && testMode !== 'custom' && (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-800/90 backdrop-blur-sm z-10">
          <div className="max-w-6xl mx-auto px-8 py-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-xs">
                  Made with ❤️ by <span className="text-purple-400 font-semibold">Rishik Dulipyata</span>
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                  <a 
                    href="https://www.linkedin.com/in/rishikdulipyata/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-purple-400 transition-colors text-xs"
                  >
                    LinkedIn
                  </a>
                  <span className="text-gray-600 text-xs">•</span>
                  <a 
                    href="https://github.com/rishikdulipyataGH" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-purple-400 transition-colors text-xs"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>typingod v1.0</span>
                <span>•</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MonkeyTypeTest;
