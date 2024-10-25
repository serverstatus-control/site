// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFE688w76tP-UchMERWCWaC5AFj-1N-iw",
  authDomain: "serverstatus-48c33.firebaseapp.com",
  projectId: "serverstatus-48c33",
  storageBucket: "serverstatus-48c33.appspot.com",
  messagingSenderId: "823350088028",
  appId: "1:823350088028:web:082c3b78687372a3fdf199"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const pageIdentifier = window.location.pathname; // Identificatore unico basato sull'URL
    const storageKey = 'selectedState_' + pageIdentifier;

    // Funzione per aggiornare la classe del testo in base allo stato selezionato
    function aggiornaClasse(testo, selectedValue) {
        testo.className = ''; // Rimuove tutte le classi esistenti
        switch (selectedValue) {
            case 'STATO NON INDICATO':
                testo.classList.add('statoNonIndicato');
                break;
            case 'SERVER CHIUSI/MANUTENZIONE PROGRAMMATA':
                testo.classList.add('serverChiusi');
                break;
            case 'SERVER CON BASSA AFFLUENZA':
                testo.classList.add('serverBassaAffluenza');
                break;
            case 'SERVER CON ALTA AFFLUENZA':
                testo.classList.add('serverAltaAffluenza');
                break;
            case 'SERVER OPERATIVI':
                testo.classList.add('serverOperativi');
                break;
            case 'SERVER CON PROBLEMI':
                testo.classList.add('serverProblemi');
                break;
            case 'SERVER CON PROBLEMI GRAVI':
                testo.classList.add('serverProblemiGravi');
                break;
            case 'SERVER IN DOWN PARZIALE':
                testo.classList.add('serverDownParziale');
                break;
            case 'SERVER IN DOWN':
                testo.classList.add('serverDown');
                break;
            case 'SERVER TUTTI IN DOWN':
                testo.classList.add('serverTuttiDown');
                break;
            case 'SERVER DISTRUTTI':
                testo.classList.add('serverDistrutti');
                break;
        }
    }

    // Funzione che cambia il testo e salva lo stato selezionato su Firebase
    function cambiaTesto() {
        const tendina = document.getElementById("miaTendina");
        const testo = document.getElementById("testo");
        const selectedValue = tendina.value;

        // Salva la selezione su Firebase
        database.ref(storageKey).set(selectedValue);

        // Aggiorna il testo e la classe
        testo.innerHTML = tendina.options[tendina.selectedIndex].text;
        aggiornaClasse(testo, selectedValue);
    }

    // Carica lo stato salvato al caricamento della pagina da Firebase
    database.ref(storageKey).on('value', function(snapshot) {
        const savedState = snapshot.val();
        if (savedState) {
            const tendina = document.getElementById("miaTendina");
            const testo = document.getElementById("testo");

            // Imposta la selezione salvata
            tendina.value = savedState;
            testo.innerHTML = tendina.options[tendina.selectedIndex].text;
            aggiornaClasse(testo, savedState);
        }
    });

    // Funzione per sbloccare la tendina con una password
    window.unlockDropdown = function() {
        const passwordInput = document.getElementById('passwordInput');
        const password = passwordInput.value.trim();
        const correctPassword = '9924'; // Sostituisci con la tua password esatta

        const tendina = document.getElementById('miaTendina');
        if (password === correctPassword) {
            tendina.disabled = false; // Sblocca la tendina
            alert('Accesso consentito!');
        } else {
            alert('Password errata. Riprova.');
        }

        // Cancella la password nel campo di input dopo l'invio
        passwordInput.value = '';
    }

    // Aggiungi l'evento onchange alla tendina per cambiare il testo dinamicamente e salvare su Firebase
    document.getElementById("miaTendina").addEventListener('change', cambiaTesto);
});
