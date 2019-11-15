const data = {};
function add(str, to) {
  data[str] = to;
}

export function tl(str) {
  if (typeof data[str] === 'undefined') return str;
  return data[str];
}

add('Ticket Name', 'Nom du Ticket');
add('Creation Date', 'Date de création');
add('Step', 'Etat');
add('Details', 'Détails');
add('Building', 'Bâtiment');

add('Sorry, nothing to display', 'Aucun Ticket retrouver');
add('Show Tickets Color', 'Affichier les Tickets');
add('Export to CSV.', 'Export en CSV.');
add('Choose a process', 'Choisissez un process');


add('id', 'Identifiant Mission');
add('name', 'Objet');
add('Date', 'Date');

add('Room', 'Local');
add('Floor', 'Etage');
add('Caller', 'Appelant');
