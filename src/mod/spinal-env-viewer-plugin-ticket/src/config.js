export const ticketConfig = {
  Domaine: {
    'BATIMENT_SECOND ŒUVRE': ['AUTRE BATIMENT', 'FENETRES',
      'MUR_CLOISONS', 'PLAFOND', 'PORTES', 'SOL', 'STORES'],
    CHAUFFAGE_VENTILATION_CLIM: ['AUTRE CLIMATISATION_CHAUFFAGE',
      'BOITIERS DOMOTIQUE', 'TEMPERATURE', 'VENTILATION'],
    ELECTRICITE: ['AUTRE ECLAIRAGE_ELECTRICITE', 'CABLES ELECTRIQUES_GOULOTTES',
      'ECLAIRAGE PLAFOND', 'INTERRUPTEURS', 'PRISES DE COURANT'],
    'ESPACES VERTS': ['ESPACES VERTS'],
    HYGIENE_PROPRETE: ['HYGIENE_PROPRETE'],
    'MOYEN DE SECOURS': ['MOYEN DE SECOURS'],
    PLOMBERIE_SANITAIRES: ['AUTRE PLOMBERIE_SANITAIRES', 'DOUCHES', 'EAU',
      'LAVABOS_EVIERS', 'URINOIRS_WC'],
    SURETE: ['AUTRE ACCES SECURISES', 'BARRIERES PARKING', 'INTERPHONES',
      'LECTEURS DE BADGE', 'PORTES AUTOMATIQUES', "PROTILLONS D'ACCCES"]
  },
  ticketPrio: {
    1: '1-Urgent',
    2: '2-Normal',
    3: '3-A l\'occasion'
  },
  states: [{
    color: '#e1dd04', api: 'ALE - Attente de lect.avant Exécution',
    label: 'En attente de Validation'
  },
  { color: '#e1dd04', api: '', label: 'En attente de Confirmation' },
  { color: '#04aef2', api: 'ARE - Attente de réalisation', label: 'En attente de réalisation' },
  // 'ENC - En cours de réalisation'
  { color: '#04aef2', api: 'REP - Réalisation partielle', label: 'En réalisation partielle' },
  { color: '#ff0000', api: '', label: 'Refusées' },
  { color: '#5cc037', api: 'CLO - Clôturée', label: 'Terminées' }
  ]
};
export const TICKET_PANEL_NAME = "Ticket Panel Manager";
export const TICKET_PANEL_TITLE = "Ticket";
export default ticketConfig;
