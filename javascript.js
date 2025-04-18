document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDFE688w76tP-UchMERWCWaC5AFj-1N-iw",
        authDomain: "serverstatus-48c33.firebaseapp.com",
        databaseURL: "https://serverstatus-48c33-default-rtdb.firebaseio.com/",
        projectId: "serverstatus-48c33",
        storageBucket: "serverstatus-48c33.appspot.com",
        messagingSenderId: "823350088028",
        appId: "1:823350088028:web:082c3b78687372a3fdf199"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const unlockButton = document.getElementById('unlockButton');
    const tendina = document.getElementById('miaTendina');
    const testo = document.getElementById("testo");

    const sanitizedPath = window.location.pathname.replace(/[.#$[\]]/g, "_");

    firebase.database().ref(`selectedState_${sanitizedPath}`).on('value', (snapshot) => {
        const savedState = snapshot.val();
        if (savedState) {
            tendina.value = savedState;
            testo.innerHTML = tendina.options[tendina.selectedIndex].text;
            aggiornaClasse(testo, savedState);
        }
    });

    unlockButton.addEventListener('click', function() {
        const passwordInput = document.getElementById('passwordInput');
        const password = passwordInput.value.trim();
        const correctPassword = '9924';

        if (password === correctPassword) {
            tendina.disabled = false; // Sblocca la tendina
            alert('Accesso consentito!');
        } else {
            alert('Password errata. Riprova.');
        }

        passwordInput.value = '';
    });

    tendina.addEventListener('change', function() {
        const selectedValue = tendina.value;
        testo.innerHTML = tendina.options[tendina.selectedIndex].text;
        aggiornaClasse(testo, selectedValue);

        firebase.database().ref(`selectedState_${sanitizedPath}`).set(selectedValue)
            .then(() => console.log('Valore salvato con successo'))
            .catch((error) => console.error('Errore nel salvataggio:', error));
    });

    function aggiornaClasse(testo, selectedValue) {
        testo.className = '';
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
});
