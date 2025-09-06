document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente caricato');
    
    // Configurazione Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDFE688w76tP-UchMERWCWaC5AFj-1N-iw",
        authDomain: "serverstatus-48c33.firebaseapp.com",
        databaseURL: "https://serverstatus-48c33-default-rtdb.firebaseio.com",
        projectId: "serverstatus-48c33",
        storageBucket: "serverstatus-48c33.appspot.com",
        messagingSenderId: "823350088028",
        appId: "1:823350088028:web:082c3b78687372a3fdf199",
        measurementId: "G-L2QQ8459D0"
    };

    // Inizializza Firebase
    let firebaseInitialized = false;
    try {
        // Verifica se Firebase è già caricato
        if (typeof firebase !== 'undefined') {
            // Controlla se Firebase è già inizializzato
            if (firebase.apps && firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
                firebaseInitialized = true;
                console.log('Firebase inizializzato con successo');
            } else if (firebase.apps && firebase.apps.length > 0) {
                // Firebase già inizializzato
                firebaseInitialized = true;
                console.log('Firebase già inizializzato');
            } else {
                console.error("Firebase apps non definito correttamente");
            }
        } else {
            console.error("Firebase non è definito, il caricamento dello script potrebbe essere fallito");
        }
    } catch (error) {
        console.error("Errore di inizializzazione Firebase:", error);
    }

    // Setup per la parte di database e stato server
    let database;
    try {
        database = firebase.database ? firebase.database() : null;
    } catch (error) {
        console.error("Firebase Database non disponibile:", error);
    }

    const unlockButton = document.getElementById('unlockButton');
    const tendina = document.getElementById('miaTendina');
    const testo = document.getElementById("testo");

    // Gestione dello stato del server se gli elementi esistono
    if (database && tendina && testo) {
        const sanitizedPath = window.location.pathname.replace(/[.#$[\]]/g, "_");

        firebase.database().ref(`selectedState_${sanitizedPath}`).on('value', (snapshot) => {
            const savedState = snapshot.val();
            if (savedState) {
                tendina.value = savedState;
                testo.innerHTML = tendina.options[tendina.selectedIndex].text;
                aggiornaClasse(testo, savedState);
            }
        });

        if (unlockButton) {
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
        }

        if (tendina) {
            tendina.addEventListener('change', function() {
                const selectedValue = tendina.value;
                testo.innerHTML = tendina.options[tendina.selectedIndex].text;
                aggiornaClasse(testo, selectedValue);

                firebase.database().ref(`selectedState_${sanitizedPath}`).set(selectedValue)
                    .then(() => console.log('Valore salvato con successo'))
                    .catch((error) => console.error('Errore nel salvataggio:', error));
            });
        }
    }

    // Funzione per aggiornare la classe in base allo stato del server
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
            case 'SERVER CON POSSIBILI PROBLEMI':
                testo.classList.add('serverPossibiliProblemi');
                break;
            case 'SERVER IN GRADUALE RIPRESA':
                testo.classList.add('serverGradualeRipresa');
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
            case 'ATTACCO HACKER IN CORSO':
                testo.classList.add('serverSottoAttacco');
                break;
            case 'SERVER DISTRUTTI':
                testo.classList.add('serverDistrutti');
                break;
        }
    }

    // --------------------------INIZIO GESTIONE AUTH------------------------------------//

    // Elementi DOM per la navbar e l'autenticazione
    const authPopup = document.getElementById('authPopup');
    const authButton = document.getElementById('authButton');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const menuToggle = document.getElementById('menuToggle');
    const menuLinks = document.getElementById('menuLinks');
    const closeBtn = document.querySelector('.close-btn');
    
    // Funzioni di validazione
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        // Per la registrazione richiediamo almeno 6 caratteri
        const hasMinLength = password.length >= 6;
        return hasMinLength;
    }

    // Gestione Popup
    function openAuthPopup() {
        console.log('Apertura popup di autenticazione');
        if (authPopup) {
            authPopup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAuthPopup() {
        console.log('Chiusura popup di autenticazione');
        if (authPopup) {
            authPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Toggle Forms - Sostituiamo gli onclick inline con addEventListener
    function toggleForms() {
        console.log('Toggle dei form');
        if (loginForm && registerForm) {
            loginForm.classList.toggle('hidden');
            registerForm.classList.toggle('hidden');
            
            // Pulisci i campi quando si passa da un form all'altro
            const loginEmail = document.getElementById('loginEmail');
            const loginPassword = document.getElementById('loginPassword');
            const registerEmail = document.getElementById('registerEmail');
            const registerPassword = document.getElementById('registerPassword');
            
            if (loginEmail) loginEmail.value = '';
            if (loginPassword) loginPassword.value = '';
            if (registerEmail) registerEmail.value = '';
            if (registerPassword) registerPassword.value = '';
        }
    }

    // Login con Firebase
    function handleLogin(e) {
        e.preventDefault();
        console.log('Tentativo di login');
        
        try {
            // Ottieni direttamente gli elementi input ogni volta
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            
            if (!emailInput || !passwordInput) {
                console.error("Elementi input non trovati");
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert('Per favore compila tutti i campi');
                return;
            }

            if (!validateEmail(email)) {
                alert('Per favore inserisci un indirizzo email valido.');
                return;
            }

            // Trova il pulsante di login
            const loginButtonSelector = loginForm.querySelector('button[type="submit"]') || loginForm.querySelector('button');
            if (!loginButtonSelector) {
                console.error("Pulsante login non trovato");
                return;
            }
            
            // Clona il pulsante per evitare problemi con gli event listener
            const loginButton = loginButtonSelector.cloneNode(true);
            loginButtonSelector.parentNode.replaceChild(loginButton, loginButtonSelector);
            
            loginButton.innerHTML = '<div class="loader"></div>';
            loginButton.disabled = true;

            // Verifica se Firebase è pronto e disponibile
            if (typeof firebase !== 'undefined' && firebase.auth) {
                console.log("Firebase auth disponibile, tentativo di login...");
                
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log('Login riuscito');
                        const user = userCredential.user;
                        alert('Login effettuato con successo!');
                        emailInput.value = '';
                        passwordInput.value = '';
                        closeAuthPopup();
                        updateAuthState(true, user.email);
                        
                        // Se c'è una tendina da sbloccare, sblocchiamola
                        if (tendina) {
                            tendina.disabled = false;
                        }
                    })
                    .catch((error) => {
                        console.error("Firebase login error:", error);
                        let errorMessage = 'Login fallito. ';
                        
                        // Gestione errori specifici di Firebase
                        if (error.code === 'auth/user-not-found') {
                            errorMessage += 'Utente non trovato.';
                        } else if (error.code === 'auth/wrong-password') {
                            errorMessage += 'Password non corretta.';
                        } else if (error.code === 'auth/too-many-requests') {
                            errorMessage += 'Troppi tentativi falliti. Riprova più tardi.';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage += 'Email non valida.';
                        } else {
                            errorMessage += error.message;
                        }
                        
                        alert(errorMessage);
                    })
                    .finally(() => {
                        loginButton.disabled = false;
                        loginButton.innerHTML = 'Sign In';
                    });
            } else {
                console.error("Firebase Auth non disponibile al momento del login");
                alert('Servizio di autenticazione non disponibile. Ricarica la pagina e riprova.');
                loginButton.disabled = false;
                loginButton.innerHTML = 'Sign In';
            }
        } catch (generalError) {
            console.error("Errore generale durante il login:", generalError);
            alert("Si è verificato un errore imprevisto. Ricarica la pagina e riprova.");
        }
    }

    // Registrazione con Firebase
    function handleRegister(e) {
        e.preventDefault();
        console.log('Tentativo di registrazione');
        
        try {
            const emailInput = document.getElementById('registerEmail');
            const passwordInput = document.getElementById('registerPassword');
            
            if (!emailInput || !passwordInput) {
                console.error("Elementi input non trovati");
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert('Per favore compila tutti i campi');
                return;
            }

            if (!validateEmail(email)) {
                alert('Per favore inserisci un indirizzo email valido.');
                return;
            }

            // Validazione password per registrazione
            const hasMinLength = password.length >= 6;
            
            if (!hasMinLength) {
                alert('La password deve essere lunga almeno 6 caratteri (si consiglia di usare caratteri speciali: #£$%&!?).');
                return;
            }

            // Trova il pulsante di registrazione
            const registerButtonSelector = registerForm.querySelector('button[type="submit"]') || registerForm.querySelector('button');
            if (!registerButtonSelector) {
                console.error("Pulsante registrazione non trovato");
                return;
            }
            
            registerButtonSelector.innerHTML = '<div class="loader"></div>';
            registerButtonSelector.disabled = true;

            // Usa Firebase per la registrazione
            if (typeof firebase !== 'undefined' && firebase.auth) {
                console.log("Firebase auth disponibile, tentativo di registrazione...");
                
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log('Registrazione riuscita');
                        const user = userCredential.user;
                        alert('Registrazione effettuata con successo!');
                        emailInput.value = '';
                        passwordInput.value = '';
                        
                        if (loginForm && registerForm) {
                            loginForm.classList.remove('hidden');
                            registerForm.classList.add('hidden');
                        }
                    })
                    .catch((error) => {
                        console.error("Firebase register error:", error);
                        
                        if (error.code === 'auth/email-already-in-use') {
                            alert('Email già registrata. Puoi effettuare il login.');
                            emailInput.value = '';
                            passwordInput.value = '';
                            
                            if (loginForm && registerForm) {
                                loginForm.classList.remove('hidden');
                                registerForm.classList.add('hidden');
                            }
                        } else if (error.code === 'auth/invalid-email') {
                            alert('Email non valida.');
                        } else if (error.code === 'auth/weak-password') {
                            alert('Password troppo debole. Deve essere di almeno 6 caratteri.');
                        } else {
                            alert('Registrazione fallita: ' + error.message);
                        }
                    })
                    .finally(() => {
                        registerButtonSelector.disabled = false;
                        registerButtonSelector.innerHTML = 'Sign Up';
                    });
            } else {
                console.error("Firebase Auth non disponibile al momento della registrazione");
                alert('Servizio di autenticazione non disponibile. Ricarica la pagina e riprova.');
                registerButtonSelector.disabled = false;
                registerButtonSelector.innerHTML = 'Sign Up';
            }
        } catch (generalError) {
            console.error("Errore generale durante la registrazione:", generalError);
            alert("Si è verificato un errore imprevisto. Ricarica la pagina e riprova.");
            
            const registerButtonSelector = registerForm?.querySelector('button');
            if (registerButtonSelector) {
                registerButtonSelector.disabled = false;
                registerButtonSelector.innerHTML = 'Sign Up';
            }
        }
    }

    // Funzione per aggiornare l'interfaccia in base allo stato di autenticazione
    function updateAuthState(isLoggedIn, username) {
        console.log('Aggiornamento stato autenticazione:', isLoggedIn ? 'logged in' : 'logged out');
        if (isLoggedIn && authButton) {
            // Utente autenticato
            authButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            `;
            authButton.title = `Logout (${username || 'User'})`;
            
            // Rimuovi eventuali vecchi eventi
            if (authButton.onclick) authButton.onclick = null;
            authButton.removeEventListener('click', openAuthPopup);
            authButton.addEventListener('click', handleLogout);
            
            // Se c'è una tendina da sbloccare, sblocchiamola
            if (tendina) {
                tendina.disabled = false;
            }
        } else if (authButton) {
            // Utente non autenticato
            authButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="5"></circle>
                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
            `;
            authButton.title = "Login/Registrazione";
            
            // Rimuovi eventuali vecchi eventi
            if (authButton.onclick) authButton.onclick = null;
            authButton.removeEventListener('click', handleLogout);
            authButton.addEventListener('click', openAuthPopup);
        }
    }

    // Funzione per il logout usando Firebase
    function handleLogout() {
        console.log('Tentativo di logout');
        if (firebase.auth) {
            firebase.auth().signOut()
                .then(() => {
                    console.log('Logout riuscito');
                    alert('Logout effettuato con successo!');
                    updateAuthState(false);
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                    alert('Errore durante il logout. Controlla la tua connessione.');
                });
        } else {
            console.error("Firebase Auth non disponibile");
            alert('Servizio di autenticazione non disponibile. Ricarica la pagina.');
        }
    }

    // Menu toggle per mobile
    if (menuToggle && menuLinks) {
        menuToggle.addEventListener('click', function() {
            menuLinks.classList.toggle('active');
        });
    }
    
    // Adatta il menu in base alla dimensione dello schermo
    function handleResize() {
        if (window.innerWidth >= 768 && menuLinks) {
            menuLinks.classList.add('active');
        } else if (window.innerWidth < 768 && menuLinks) {
            menuLinks.classList.remove('active');
        }
    }
    
    // Esegui al caricamento e su resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Effetto navbar durante lo scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });

    // Controlla se l'utente è già loggato all'avvio
    try {
        if (firebase.auth) {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // Utente è loggato
                    console.log('Utente autenticato:', user.email);
                    updateAuthState(true, user.email);
                } else {
                    // Nessun utente loggato
                    console.log('Nessun utente autenticato');
                    updateAuthState(false);
                }
            });
        } else {
            console.error('Firebase Auth non disponibile');
        }
    } catch (error) {
        console.error('Errore nel controllo stato autenticazione:', error);
    }

    // Configura tutti gli event listeners
    if (authButton) {
        // Rimuoviamo eventuali vecchi eventi prima di aggiungerne di nuovi
        if (authButton.onclick) authButton.onclick = null;
        // Controllare lo stato di autenticazione iniziale
        if (firebase.auth && firebase.auth().currentUser) {
            authButton.addEventListener('click', handleLogout);
        } else {
            authButton.addEventListener('click', openAuthPopup);
        }
    }

    if (closeBtn) {
        if (closeBtn.onclick) closeBtn.onclick = null;
        closeBtn.addEventListener('click', closeAuthPopup);
    }

    if (loginForm) {
        console.log('Configurazione form di login');
        // Rimuovere gli event listener precedenti senza clonare per evitare problemi
        loginForm.removeEventListener('submit', handleLogin);
        
        // Aggiungiamo un nuovo event listener
        loginForm.addEventListener('submit', function(e) {
            // Usiamo una funzione wrapper per gestire eventuali errori
            try {
                handleLogin(e);
            } catch (error) {
                console.error("Errore durante il login:", error);
                alert("Si è verificato un errore imprevisto. Ricarica la pagina e riprova.");
            }
        });
    }

    if (registerForm) {
        console.log('Configurazione form di registrazione');
        // Rimuovere gli event listener precedenti senza clonare per evitare problemi
        registerForm.removeEventListener('submit', handleRegister);
        
        // Aggiungiamo un nuovo event listener
        registerForm.addEventListener('submit', function(e) {
            // Usiamo una funzione wrapper per gestire eventuali errori
            try {
                handleRegister(e);
            } catch (error) {
                console.error("Errore durante la registrazione:", error);
                alert("Si è verificato un errore imprevisto. Ricarica la pagina e riprova.");
            }
        });
    }

    // Gestisci i toggle links con la nuova classe
    const toggleLinks = document.querySelectorAll('.toggle-form-link');
    console.log('Trovati toggle links:', toggleLinks.length);
    
    // Rimuovere eventuali vecchi eventi prima di aggiungerne di nuovi
    toggleLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        if (link.parentNode) {
            link.parentNode.replaceChild(newLink, link);
        }
        newLink.addEventListener('click', function(e) {
            console.log('Toggle link cliccato');
            e.preventDefault();
            
            // Riferimento aggiornato ai form dopo il cloning
            const loginFormRef = document.getElementById('loginForm');
            const registerFormRef = document.getElementById('registerForm');
            
            if (loginFormRef && registerFormRef) {
                loginFormRef.classList.toggle('hidden');
                registerFormRef.classList.toggle('hidden');
                
                // Pulisci i campi quando si passa da un form all'altro
                const loginEmail = document.getElementById('loginEmail');
                const loginPassword = document.getElementById('loginPassword');
                const registerEmail = document.getElementById('registerEmail');
                const registerPassword = document.getElementById('registerPassword');
                
                if (loginEmail) loginEmail.value = '';
                if (loginPassword) loginPassword.value = '';
                if (registerEmail) registerEmail.value = '';
                if (registerPassword) registerPassword.value = '';
            }
        });
    });

    console.log('Configurazione completata');
});