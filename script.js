// --- FULL SCRIPT.JS ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("AetherMint Script Initializing... Attempting to replace Feather icons now.");
    try {
        feather.replace();
        console.log("Feather icons replaced successfully.");
    } catch (e) {
        console.error("Error replacing Feather icons:", e);
    }

    const CREATED_TOKENS_STORAGE_KEY = 'aethermintUserTokens';
    const USER_LIQUIDITY_POOLS_KEY = 'aethermintUserLiquidityPools';
    let currentPaymentServiceContext = 'default'; 
    let currentLpToRemove = null; 

    // Active Nav Link
    const currentLocation = window.location.pathname.split("/").pop() || "index.html"; 
    const navLinks = document.querySelectorAll('header nav .nav-link'); 
    navLinks.forEach(link => { 
        const linkHref = link.getAttribute('href').split("/").pop(); 
        if (linkHref === currentLocation) { link.classList.add('active'); } 
        else { link.classList.remove('active'); } 
    });

    // Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-in-section, .stat-number'); 
    const observerCallback = (entries, observerInstance) => { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                if (entry.target.classList.contains('fade-in-section')) { 
                    const delay = parseFloat(entry.target.dataset.delay) || 0; 
                    setTimeout(() => { entry.target.classList.add('is-visible'); }, delay * 1000); 
                } 
                if (entry.target.classList.contains('stat-number')) { 
                    animateCountUp(entry.target); 
                } 
                observerInstance.unobserve(entry.target); 
            } 
        }); 
    }; 
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 }; 
    const observer = new IntersectionObserver(observerCallback, observerOptions); 
    animatedElements.forEach(el => { 
        if (el.closest('.hero-section') && !el.classList.contains('stat-number') && !el.classList.contains('scroll-down-indicator')) { 
            const delay = parseFloat(el.dataset.delay) || 0; 
            setTimeout(() => { el.classList.add('is-visible'); }, delay * 1000 + 50); 
        } else { observer.observe(el); } 
    });
    function animateCountUp(element) { 
        const targetCount = parseInt(element.dataset.count); 
        let currentCount = 0; 
        const duration = 2000; 
        const stepTime = Math.max(10, Math.abs(Math.floor(duration / targetCount))) || 50; 
        const timer = setInterval(() => { 
            const increment = Math.ceil(targetCount / (duration / stepTime)); 
            currentCount += increment; 
            if (currentCount >= targetCount) { currentCount = targetCount; clearInterval(timer); } 
            element.textContent = currentCount.toLocaleString(); 
        }, stepTime); 
    }

    // --- TRENDING COINS DATA (Now a "Coming Soon" page, this data isn't directly used but can remain) ---
    const adjectives = ["Cosmic", "Quantum", "Galactic", "gaping", "big", "black", "Solar", "Lunar", "Astro", "Robo", "Degen", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Omega", "Kappa", "Sigma", "Tau", "Phantom", "Shadow", "Crystal", "Blaze", "Frost", "Storm", "Void", "Star", "Nebula"]; const nouns = ["Gecko", "Punks", "Surfers", "Apes", "Cats", "Quokkas", "Monkes", "Canines", "Ducks", "Raptors", "Llamas", "Sharks", "Wolves", "Bears", "Goats", "Dolphins", "Eagles", "Zebras", "Owls", "Koalas", "Sloths", "Turtles", "Dragons", "Knights", "Wizards", "Pirates", "Ninjas", "Samurai", "Titans", "Phoenix"]; const tags = ["HOT", "DAO", "DEFI", "NFT", "NEW", "EXPERIMENTAL", "TOP RATED", "COMMUNITY", "MEME KING", "GAMING", "CHILL", "YIELD FARM", "LEADER", "CAUTIOUS", "PERSISTENT", "SMART", "VISIONARY", "UTILITY", "NIGHT OWL", "HODL", "PATIENCE", "SECURITY", "LEGENDARY", "RARE", "EPIC", "UNCOMMON", "MYTHIC", "FUTURISTIC", "RETRO", "VINTAGE"]; const descriptions = [ "Navigating the digital cosmos, one block at a time.", "A community-driven project aiming for the stars.", "Riding the an_style_waves of decentralized innovation.", "Exploring new frontiers on the robust Solana blockchain.", "The future is now, and it's tokenized.", "The happiest and most groundbreaking project in DeFi.", "Unravel the mysteries of value with this unique token.", "Loyal companions for your crypto journey.", "Making a splash in the meme coin universe!", "Engineered for performance and community rewards.", "Gracefully ascending the charts on Solana.", "Apex predators in the DeFi ecosystem, seeking maximum value.", "Leading the pack with cutting-edge features.", "A carefully crafted token for the discerning investor.", "Stubbornly climbing to new all-time highs.", "Intelligent tokenomics meet playful community engagement.", "Soaring above the rest with unparalleled vision.", "Unique utility and a strong development team.", "The wisest choice for your diversified portfolio.", "Chilling, HODLing, and enjoying the ride to the moon.", "Slow and steady accumulation for long-term gains.", "Fortified security for your valuable digital assets.", "A legendary token spoken of in hushed whispers.", "A rare find in the vast expanse of crypto projects.", "An epic journey awaits those who dare to invest.", "An uncommon blend of utility and meme potential.", "Mythic gains await the true believers.", "Harnessing futuristic technology for today's market.", "A retro-inspired token with modern appeal.", "Vintage charm meets blockchain innovation." ]; 
    const allTrendingCoinsData = []; for (let i = 0; i < 30; i++) { let dailySet = []; const numCoinsThisDay = Math.floor(Math.random() * 2) + 3; let usedNamesThisDay = new Set(); for (let j = 0; j < numCoinsThisDay; j++) { let name, symbol; do { const adj = adjectives[Math.floor(Math.random() * adjectives.length)]; const noun = nouns[Math.floor(Math.random() * nouns.length)]; name = `${adj} ${noun}`; symbol = (adj.substring(0, Math.min(2, adj.length)) + noun.substring(0, Math.min(2, noun.length))).toUpperCase() + (Math.floor(Math.random()*90)+10); } while (usedNamesThisDay.has(name)); usedNamesThisDay.add(name); dailySet.push({ name: name, symbol: symbol, marketCap: Math.floor(Math.random() * 450000) + 50000, description: descriptions[Math.floor(Math.random() * descriptions.length)], tag: tags[Math.floor(Math.random() * tags.length)] }); } allTrendingCoinsData.push(dailySet); }
    function getTodaysTrendingCoins() { const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24); const index = dayOfYear % allTrendingCoinsData.length; return allTrendingCoinsData[index]; }
    function displayTrendingCoins(coinsToDisplay) { 
        const grid = document.getElementById('trendingCoinsGrid'); 
        if (!grid) return; // This will now correctly exit if on the "Coming Soon" page
        grid.innerHTML = ''; 
        if (!coinsToDisplay || coinsToDisplay.length === 0) { 
            grid.innerHTML = `<div class="empty-state card-style"><i data-feather="alert-circle"></i><p>No trending tokens available at the moment. Check back soon!</p></div>`; 
            feather.replace(); 
            return; 
        }
        coinsToDisplay.forEach(coin => { 
            const coinCard = ` 
                <div class="coin-card card-style fade-in-section"> 
                    <div class="coin-header"> 
                        <img src="placeholder-coin-${(Math.floor(Math.random()*3)+1)}.png" alt="${coin.name} Icon"> 
                        <div> 
                            <h4>${coin.name} ${coin.tag ? `<span class="tag">${coin.tag}</span>` : ''}</h4> 
                            <p class="coin-symbol">${coin.symbol}</p> 
                        </div> 
                    </div> 
                    <p class="coin-description">${coin.description}</p> 
                    <div class="coin-footer"> 
                        <div class="market-cap"> 
                            Market Cap: <span class="highlight">$${coin.marketCap.toLocaleString()}</span> 
                            <small>Last trade: Just now</small> 
                        </div> 
                        <button class="btn btn-primary btn-sm create-from-template-btn"><i data-feather="copy"></i> Copy & Mint</button> 
                    </div> 
                </div> `; 
            grid.insertAdjacentHTML('beforeend', coinCard); 
        }); 
        feather.replace(); 
        document.querySelectorAll('#trendingCoinsGrid .fade-in-section').forEach(el => observer.observe(el)); 
        document.querySelectorAll('#trendingCoinsGrid .create-from-template-btn').forEach(button => { 
            button.addEventListener('click', (e) => { 
                e.preventDefault(); 
                openPaymentModal('copyTrend', 0.5); // This cost is for copying a trend, separate from creation/LP
            }); 
        }); 
    }
    function initializeTrendingCoinsPage() { // This function is fine, will just exit if grid not found
        const currentCoins = getTodaysTrendingCoins(); 
        displayTrendingCoins(currentCoins);
    }


    // --- PAYMENT MODAL ---
    let paymentModalInstance; 
    const YOUR_WALLET_ADDRESS = "EHbRnWKLmyu7F2N5ENPhV8hR4YUmESaJZzqu2b99kEkN"; 
    
    function formatSolAmount(amount) {
        const num = Number(amount);
        if (isNaN(num)) return '0'; 

        let str = num.toFixed(9); 
        if (str.includes('.')) {
            str = str.replace(/0+$/, ''); 
            if (str.endsWith('.')) { 
                str = str.substring(0, str.length - 1);
            }
        }
        return str; 
    }

    function initializePaymentModal() { 
        paymentModalInstance = document.getElementById('paymentModal'); 
        if (!paymentModalInstance) return; 
        const closeButton = document.getElementById('paymentModalCloseBtn') || paymentModalInstance.querySelector('.close-button'); 
        const cancelPaymentButton = paymentModalInstance.querySelector('#cancelPaymentButton'); 
        const confirmPaymentButton = paymentModalInstance.querySelector('#confirmPaymentButton'); 
        const paymentWalletAddressEl = paymentModalInstance.querySelector('#paymentWalletAddress'); 
        const copyAddressButton = paymentModalInstance.querySelector('#copyAddressButton'); 
        
        if(paymentWalletAddressEl) paymentWalletAddressEl.textContent = YOUR_WALLET_ADDRESS; 
        if(closeButton) closeButton.addEventListener('click', closePaymentModal); 
        if(cancelPaymentButton) cancelPaymentButton.addEventListener('click', closePaymentModal); 
        
        if(confirmPaymentButton) { 
            confirmPaymentButton.addEventListener('click', function() { 
                const paymentStatusEl = paymentModalInstance.querySelector('#paymentStatus'); 
                if(paymentStatusEl) { 
                    paymentStatusEl.textContent = 'Processing payment... Please wait.'; 
                    paymentStatusEl.className = 'processing'; 
                    paymentStatusEl.style.display = 'block'; 
                } 
                setTimeout(() => { 
                    const isSuccess = Math.random() > 0.2;
                    if (paymentStatusEl) { 
                        if (isSuccess) { 
                            paymentStatusEl.textContent = 'Payment confirmed! Your action is being processed.'; 
                            paymentStatusEl.className = 'success'; 
                            const pagePath = currentLocation; 

                            if (pagePath.includes('create-token.html') && currentPaymentServiceContext === 'mintNew') {
                                const form = document.getElementById('token-creation-form');
                                if (form) {
                                    const tokenNameInput = form.querySelector('#tokenName');
                                    const tokenSymbolInput = form.querySelector('#tokenSymbol');
                                    const tokenImagePreview = form.querySelector('#imagePreview'); 

                                    if (tokenNameInput && tokenSymbolInput && tokenNameInput.value && tokenSymbolInput.value) {
                                        const tokenName = tokenNameInput.value;
                                        const tokenSymbol = tokenSymbolInput.value.toUpperCase();
                                        const tokenImageSrc = (tokenImagePreview && tokenImagePreview.src !== '#' && tokenImagePreview.style.display !== 'none' && !tokenImagePreview.src.endsWith(window.location.pathname)) ? tokenImagePreview.src : '';

                                        let userTokens = JSON.parse(localStorage.getItem(CREATED_TOKENS_STORAGE_KEY)) || [];
                                        const newToken = {
                                            id: tokenSymbol.replace(/\s+/g, '-').substring(0,10) + `_${Date.now()}`,
                                            name: tokenName,
                                            symbol: tokenSymbol,
                                            imageSrc: tokenImageSrc 
                                        };
                                        if (!userTokens.find(t => t.name === newToken.name && t.symbol === newToken.symbol)) {
                                            userTokens.push(newToken);
                                            localStorage.setItem(CREATED_TOKENS_STORAGE_KEY, JSON.stringify(userTokens));
                                            paymentStatusEl.textContent = `Payment confirmed! ${newToken.name} (${newToken.symbol}) has been minted.`; //
                                        } else {
                                            paymentStatusEl.textContent = `Payment confirmed! ${newToken.name} (${newToken.symbol}) was already minted or is a duplicate.`;
                                        }
                                    }
                                }
                            } else if (currentPaymentServiceContext === 'createLP') {
                                const lpTokenSelect = document.getElementById('lpTokenSelect');
                                const baseTokenAmountInput = document.getElementById('baseTokenAmount');
                                const quoteTokenAmountInput = document.getElementById('quoteTokenAmount');

                                if (lpTokenSelect && lpTokenSelect.value && baseTokenAmountInput && quoteTokenAmountInput) {
                                    const selectedOption = lpTokenSelect.options[lpTokenSelect.selectedIndex];
                                    const tokenId = selectedOption.value;
                                    let tokenName = '';
                                    let tokenSymbol = '';
                                    let tokenImageSrcForLP = ''; 

                                    const userTokensForLP = JSON.parse(localStorage.getItem(CREATED_TOKENS_STORAGE_KEY)) || [];
                                    const foundToken = userTokensForLP.find(t => t.id === tokenId);
                                    if (foundToken) {
                                        tokenName = foundToken.name;
                                        tokenSymbol = foundToken.symbol;
                                        tokenImageSrcForLP = foundToken.imageSrc || ''; 
                                    } else { 
                                        const match = selectedOption.textContent.match(/(.*) \((.*)\)/);
                                        if (match) { tokenName = match[1]; tokenSymbol = match[2];}
                                    }
                                    
                                    if (tokenName && tokenSymbol) {
                                        const newLP = {
                                            id: `lp_${tokenId}_${Date.now()}`,
                                            tokenName: tokenName,
                                            tokenSymbol: tokenSymbol,
                                            tokenImageSrc: tokenImageSrcForLP, 
                                            baseAmount: parseFloat(baseTokenAmountInput.value).toLocaleString(),
                                            quoteAmount: formatSolAmount(parseFloat(quoteTokenAmountInput.value)),
                                            quoteSymbol: "SOL",
                                            creationDate: new Date().toISOString()
                                        };
                                        let userLPs = JSON.parse(localStorage.getItem(USER_LIQUIDITY_POOLS_KEY)) || [];
                                        userLPs.push(newLP);
                                        localStorage.setItem(USER_LIQUIDITY_POOLS_KEY, JSON.stringify(userLPs));
                                        paymentStatusEl.textContent = `Payment confirmed! LP for ${tokenName} created.`;
                                        if (typeof displayUserLiquidityPools === "function") displayUserLiquidityPools();
                                    }
                                }
                            } else if (currentPaymentServiceContext === 'copyTrend') {
                                paymentStatusEl.textContent = 'Payment confirmed! Copied trending token confirmed.';
                            }

                            setTimeout(() => { 
                                closePaymentModal(); 
                                if (pagePath.includes('create-token.html')) { 
                                    const form = document.getElementById('token-creation-form'); 
                                    if (form) { 
                                        form.reset(); 
                                        const imagePreview = form.querySelector('#imagePreview'); 
                                        const uploadText = form.querySelector('#upload-text'); 
                                        const uploadIconItself = form.querySelector('.upload-icon'); 
                                        if(imagePreview && imagePreview.style) { imagePreview.src = '#'; imagePreview.style.display = 'none'; } 
                                        if(uploadText && uploadText.style) uploadText.style.display = 'inline'; 
                                        if(uploadIconItself && uploadIconItself.style) uploadIconItself.style.display = 'block'; 
                                        if (typeof showStep === "function") showStep(1);
                                        ['#revokeFreezeCard', '#revokeMintCard', '#revokeUpdateCard'].forEach(selector => {
                                            const card = form.querySelector(selector);
                                            if (card) {
                                                card.dataset.selected = 'true';
                                                const btn = card.querySelector('.revoke-select-btn');
                                                if(btn) {
                                                    btn.textContent = 'Selected';
                                                    btn.classList.add('btn-primary');
                                                    btn.classList.remove('btn-secondary');
                                                }
                                            }
                                        });
                                        if (typeof updateTotalMintCostAndReview === "function") updateTotalMintCostAndReview();
                                        if (typeof updateStepperDisplay === "function") updateStepperDisplay(true);
                                    } 
                                } else if (pagePath.includes('create-liquidity.html')) {
                                    const baseTokenAmountEl = document.getElementById('baseTokenAmount');
                                    const quoteTokenAmountEl = document.getElementById('quoteTokenAmount');
                                    const lpTokenSelectEl = document.getElementById('lpTokenSelect');
                                    if(baseTokenAmountEl) baseTokenAmountEl.value = '';
                                    if(quoteTokenAmountEl) quoteTokenAmountEl.value = '1'; 
                                    if(lpTokenSelectEl) lpTokenSelectEl.selectedIndex = 0;
                                }
                            }, 2500); 
                        } else { 
                            paymentStatusEl.textContent = 'Payment not detected or failed. Please try again.'; 
                            paymentStatusEl.className = 'error'; 
                        } 
                    } 
                }, 2000); 
            }); 
        } 
        if(copyAddressButton) { 
            copyAddressButton.addEventListener('click', () => { 
                navigator.clipboard.writeText(YOUR_WALLET_ADDRESS).then(() => { 
                    const originalIconHTML = copyAddressButton.innerHTML; 
                    copyAddressButton.innerHTML = '<i data-feather="check-circle"></i> Copied!'; 
                    feather.replace(); 
                    setTimeout(() => { copyAddressButton.innerHTML = originalIconHTML; feather.replace(); }, 2000); 
                }).catch(err => { alert('Failed to copy address.'); }); 
            }); 
        } 
        window.addEventListener('click', function(event) { if (paymentModalInstance && event.target == paymentModalInstance) { closePaymentModal(); } }); 
    }

    window.openPaymentModal = function(context = 'default', cost = 0.1) { 
        if (!paymentModalInstance) initializePaymentModal(); 
        if (!paymentModalInstance) {console.error("Payment modal not found"); return;} 
        currentPaymentServiceContext = context;

        let finalCost = cost;
        if (context === 'createLP') {
            const quoteTokenAmountInput = document.getElementById('quoteTokenAmount');
            const userSolAmount = parseFloat(quoteTokenAmountInput.value);
            if (!isNaN(userSolAmount) && userSolAmount >= 0) { 
                finalCost += userSolAmount; 
            }
        }

        const paymentModalTitleEl = paymentModalInstance.querySelector('#paymentModalTitle'); 
        const modalInfoTextEl = paymentModalInstance.querySelector('#modalInfoText'); 
        const paymentStatusEl = paymentModalInstance.querySelector('#paymentStatus'); 
        if(paymentStatusEl) { paymentStatusEl.textContent = ''; paymentStatusEl.className = ''; paymentStatusEl.style.display = 'none'; } 
        let titleText = "Complete Payment"; 
        switch(context) { 
            case 'mintNew': titleText = '<i data-feather="zap"></i> Mint Your New Token'; break; 
            case 'copyTrend': titleText = '<i data-feather="copy"></i> Mint Copied Token Design'; break; 
            case 'createLP': titleText = '<i data-feather="droplet"></i> Fund Liquidity Pool'; break; 
        } 
        if(paymentModalTitleEl) paymentModalTitleEl.innerHTML = titleText; 
        if(modalInfoTextEl) { 
            modalInfoTextEl.innerHTML = `To proceed, please send exactly <strong id="paymentAmount" class="highlight">${formatSolAmount(finalCost)} SOL</strong> to the following Solana address:`; 
        } 
        feather.replace(); 
        paymentModalInstance.style.display = 'block'; 
    }
    window.closePaymentModal = function() { if (paymentModalInstance) { paymentModalInstance.style.display = 'none'; } }
    
    let confirmRemoveLpModalInstance;
    function initializeConfirmRemoveLpModal() {
        confirmRemoveLpModalInstance = document.getElementById('confirmRemoveLpModal');
        if (!confirmRemoveLpModalInstance) return;
        const closeBtn = document.getElementById('closeConfirmRemoveLpModalBtn');
        const cancelBtn = confirmRemoveLpModalInstance.querySelector('#cancelRemoveLpButton');
        const confirmActionBtn = confirmRemoveLpModalInstance.querySelector('#confirmRemoveLpButtonAction');
        if (closeBtn) closeBtn.addEventListener('click', closeConfirmRemoveLpModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeConfirmRemoveLpModal);
        if (confirmActionBtn) {
            confirmActionBtn.addEventListener('click', () => {
                if (currentLpToRemove && currentLpToRemove.id) {
                    let currentLPs = JSON.parse(localStorage.getItem(USER_LIQUIDITY_POOLS_KEY)) || [];
                    currentLPs = currentLPs.filter(p => p.id !== currentLpToRemove.id);
                    localStorage.setItem(USER_LIQUIDITY_POOLS_KEY, JSON.stringify(currentLPs));
                    if (typeof displayUserLiquidityPools === "function") displayUserLiquidityPools(); 
                    console.log(`${currentLpToRemove.name} pool has been removed.`);
                }
                closeConfirmRemoveLpModal();
            });
        }
        window.addEventListener('click', function(event) { 
            if (confirmRemoveLpModalInstance && event.target == confirmRemoveLpModalInstance) closeConfirmRemoveLpModal(); 
        });
    }

    window.openConfirmRemoveLpModal = function(lpId, lpName) {
        if (!confirmRemoveLpModalInstance) initializeConfirmRemoveLpModal();
        if (!confirmRemoveLpModalInstance) { console.error("Confirm Remove LP Modal not found"); return; }
        currentLpToRemove = { id: lpId, name: lpName }; 
        const messageEl = confirmRemoveLpModalInstance.querySelector('#confirmRemoveLpModalMessage');
        if (messageEl) {
            messageEl.innerHTML = `Are you sure you want to remove the <strong class="highlight">${lpName}</strong> liquidity pool? This action cannot be undone.`;
        }
        feather.replace(); 
        confirmRemoveLpModalInstance.style.display = 'block';
    }

    window.closeConfirmRemoveLpModal = function() {
        if (confirmRemoveLpModalInstance) confirmRemoveLpModalInstance.style.display = 'none';
        currentLpToRemove = null; 
    }

    // --- Token Creation Form ---
    let showStep; 
    let currentTotalMintCost = 0.4; // Initial default: 0.1 (base) + 0.1*3 (all options true)
    let step3Elements = {}; 
    let stepperStepsElements = []; 
    let formElement; 
    let currentFormStepGlobal = 1;

    function updateTotalMintCostAndReview() {
        if (!step3Elements.formStep || !document.body.contains(step3Elements.formStep)) return;
        let cost = 0.1; // UPDATED BASE COST
        let revokeFreezeSelected = false;
        let revokeMintSelected = false;
        let revokeUpdateSelected = false;

        if (step3Elements.revokeFreezeCard && step3Elements.revokeFreezeCard.dataset.selected === 'true') { cost += 0.1; revokeFreezeSelected = true; }
        if (step3Elements.revokeMintCard && step3Elements.revokeMintCard.dataset.selected === 'true') { cost += 0.1; revokeMintSelected = true; }
        if (step3Elements.revokeUpdateCard && step3Elements.revokeUpdateCard.dataset.selected === 'true') { cost += 0.1; revokeUpdateSelected = true; }
        
        currentTotalMintCost = parseFloat(cost.toFixed(1));
        
        if (step3Elements.totalMintCostEl) step3Elements.totalMintCostEl.textContent = `${formatSolAmount(currentTotalMintCost)} SOL`;
        
        if (step3Elements.reviewRevokeFreezeEl) step3Elements.reviewRevokeFreezeEl.textContent = revokeFreezeSelected ? 'Yes' : 'No';
        if (step3Elements.reviewRevokeMintEl) step3Elements.reviewRevokeMintEl.textContent = revokeMintSelected ? 'Yes' : 'No';
        if (step3Elements.reviewRevokeUpdateEl) step3Elements.reviewRevokeUpdateEl.textContent = revokeUpdateSelected ? 'Yes' : 'No';
        
        feather.replace(); 
    }

    function updateStepperDisplay(forceFullUpdate = false) {
        if (!formElement || stepperStepsElements.length === 0) return;
        document.querySelectorAll('#token-creator .stepper .step-line').forEach(line => {
            line.style.backgroundColor = 'var(--overlay0-color)';
        });
        stepperStepsElements.forEach((stepEl, index) => {
            const stepNum = parseInt(stepEl.dataset.step);
            const lineAfterThisStep = stepEl.nextElementSibling;
            stepEl.classList.remove('active', 'completed');

            if (stepNum < currentFormStepGlobal) {
                stepEl.classList.add('completed');
                if (lineAfterThisStep && lineAfterThisStep.classList.contains('step-line')) {
                    lineAfterThisStep.style.backgroundColor = 'var(--success-accent)';
                }
            } else if (stepNum === currentFormStepGlobal) {
                stepEl.classList.add('active');
                let isInternallyComplete = false;
                if (stepNum === 1) {
                    const step1Form = formElement.querySelector('.form-step[data-step="1"]');
                    const step1ImageUploaded = formElement.querySelector('#imagePreview') && formElement.querySelector('#imagePreview').src !== '#' && formElement.querySelector('#imagePreview').style.display !== 'none' && !formElement.querySelector('#imagePreview').src.endsWith(window.location.pathname) ;
                    let allStep1FieldsFilled = true;
                    if (step1Form) {
                        const step1RequiredInputs = step1Form.querySelectorAll('input[required]:not([type="file"]), textarea[required]');
                        step1RequiredInputs.forEach(input => { if (!input.value.trim()) allStep1FieldsFilled = false; });
                    }
                    if (allStep1FieldsFilled && step1ImageUploaded) { stepEl.classList.add('completed'); isInternallyComplete = true;}

                } else if (stepNum === 2) {
                    const step2Form = formElement.querySelector('.form-step[data-step="2"]');
                    if (step2Form) {
                        const step2RequiredInputs = step2Form.querySelectorAll('input[required], textarea[required]');
                        let allStep2FieldsFilled = true;
                        step2RequiredInputs.forEach(input => { if (!input.value.trim()) allStep2FieldsFilled = false; });
                        if (allStep2FieldsFilled) { stepEl.classList.add('completed'); isInternallyComplete = true; }
                    }
                }
                if (lineAfterThisStep && lineAfterThisStep.classList.contains('step-line')) {
                    lineAfterThisStep.style.backgroundColor = isInternallyComplete ? 'var(--success-accent)' : 'var(--primary-accent)';
                }
            }
        });
    }
    
    function initializeTokenCreationForm() {
        formElement = document.getElementById('token-creation-form');
        if (!formElement) return; 
        const formSteps = formElement.querySelectorAll('.form-step');
        const nextStepButtons = formElement.querySelectorAll('.next-step');
        const prevStepButtons = formElement.querySelectorAll('.prev-step');
        stepperStepsElements = Array.from(document.querySelectorAll('#token-creator .stepper .step'));
        let imageUploadedFlag = false; 

        step3Elements.formStep = formElement.querySelector('.form-step[data-step="3"]');
        if (step3Elements.formStep) {
            step3Elements.revokeFreezeCard = step3Elements.formStep.querySelector('#revokeFreezeCard');
            step3Elements.revokeMintCard = step3Elements.formStep.querySelector('#revokeMintCard');
            step3Elements.revokeUpdateCard = step3Elements.formStep.querySelector('#revokeUpdateCard');
            step3Elements.reviewRevokeFreezeEl = step3Elements.formStep.querySelector('#reviewRevokeFreeze');
            step3Elements.reviewRevokeMintEl = step3Elements.formStep.querySelector('#reviewRevokeMint');
            step3Elements.reviewRevokeUpdateEl = step3Elements.formStep.querySelector('#reviewRevokeUpdate');
            step3Elements.totalMintCostEl = step3Elements.formStep.querySelector('#totalMintCost');
            
            [step3Elements.revokeFreezeCard, step3Elements.revokeMintCard, step3Elements.revokeUpdateCard].forEach(card => {
                if (card) {
                    const button = card.querySelector('.revoke-select-btn');
                    const toggleSelection = (cardElement, buttonElement) => {
                        const isCurrentlySelected = cardElement.dataset.selected === 'true';
                        const newSelectedState = !isCurrentlySelected;
                        cardElement.dataset.selected = newSelectedState ? 'true' : 'false';
                        if (buttonElement) {
                            buttonElement.textContent = newSelectedState ? 'Selected' : 'Deselect';
                            buttonElement.classList.toggle('btn-primary', newSelectedState);
                            buttonElement.classList.toggle('btn-secondary', !newSelectedState);
                        }
                        updateTotalMintCostAndReview();
                    };
                    card.addEventListener('click', function(event) { if (!event.target.closest('.revoke-select-btn') && !event.target.closest('.option-cost')) toggleSelection(this, button); });
                    if (button) button.addEventListener('click', function(e) { e.stopPropagation(); toggleSelection(this.closest('.revoke-option-card'), this); });
                }
            });
        }
        
        const step1Form = formElement.querySelector('.form-step[data-step="1"]');
        if(step1Form) {
            const step1RequiredInputs = step1Form.querySelectorAll('input[required]:not([type="file"]), textarea[required]');
            step1RequiredInputs.forEach(input => input.addEventListener('input', () => { if (currentFormStepGlobal === 1) updateStepperDisplay(); }));
        }
        const step2Form = formElement.querySelector('.form-step[data-step="2"]');
        if (step2Form) {
            const step2RequiredInputs = step2Form.querySelectorAll('input[required], textarea[required]');
            step2RequiredInputs.forEach(input => input.addEventListener('input', () => { if (currentFormStepGlobal === 2) updateStepperDisplay(); }));
        }
        
        const originalShowStep = function(stepNumber) {
            formSteps.forEach(step => {
                step.classList.remove('active-step');
                if (parseInt(step.dataset.step) === stepNumber) step.classList.add('active-step');
            });
            currentFormStepGlobal = stepNumber;
            updateStepperDisplay();
            if (stepNumber === 3) { populateReviewDetails(); updateTotalMintCostAndReview(); }
        };
        showStep = originalShowStep;

        const handleNextStep = (button) => {
            const currentFormStepEl = formElement.querySelector(`.form-step[data-step="${currentFormStepGlobal}"]`);
            let isValid = true; let errorMessages = [];
            if (currentFormStepEl) {
                const inputs = currentFormStepEl.querySelectorAll('input[required]:not([type="file"]), textarea[required]');
                inputs.forEach(input => {
                    if (!input.value.trim()) { isValid = false; input.style.borderColor = 'var(--danger-accent)'; if (!errorMessages.includes('Please fill in all required text fields.')) errorMessages.push('Please fill in all required text fields.'); } 
                    else input.style.borderColor = 'var(--crust-border)';
                });
                if (currentFormStepGlobal === 1 && button.id === 'step1NextButton' && !imageUploadedFlag) { 
                    isValid = false; const uploadBoxForError = formElement.querySelector('.image-upload-box');
                    if (uploadBoxForError) uploadBoxForError.style.borderColor = 'var(--danger-accent)';
                    if (!errorMessages.includes('Please upload a token image to proceed.')) errorMessages.push('Please upload a token image to proceed.');
                } else if (currentFormStepGlobal === 1 && imageUploadedFlag) { 
                    const uploadBoxForError = formElement.querySelector('.image-upload-box');
                    if (uploadBoxForError) uploadBoxForError.style.borderColor = 'var(--surface0-color)';
                }
            }
            const existingErrorMsgEl = currentFormStepEl ? currentFormStepEl.querySelector('.form-error-msg') : null;
            if (existingErrorMsgEl) existingErrorMsgEl.remove();
            if (!isValid) {
                const errorMsgEl = document.createElement('p'); errorMsgEl.className = 'form-error-msg'; errorMsgEl.innerHTML = errorMessages.join('<br>');
                errorMsgEl.style.color = 'var(--danger-accent)'; errorMsgEl.style.fontSize = '0.9em'; errorMsgEl.style.marginTop = '10px';
                let targetForError = currentFormStepEl.querySelector('.form-buttons') || currentFormStepEl;
                if (targetForError && targetForError.parentNode) targetForError.parentNode.insertBefore(errorMsgEl, targetForError.nextSibling);
                else if (currentFormStepEl) currentFormStepEl.appendChild(errorMsgEl);
                return;
            }
            if (currentFormStepGlobal < formSteps.length) showStep(currentFormStepGlobal + 1);
        };

        nextStepButtons.forEach(button => button.addEventListener('click', () => handleNextStep(button)));
        prevStepButtons.forEach(button => button.addEventListener('click', () => { if (currentFormStepGlobal > 1) showStep(currentFormStepGlobal - 1); }));
        
        const tokenImageInput = formElement.querySelector('#tokenImage'); 
        const imagePreview = formElement.querySelector('#imagePreview');   
        const uploadText = formElement.querySelector('#upload-text');     
        const uploadIconItself = formElement.querySelector('.upload-icon'); 
        const imageUploadBox = formElement.querySelector('#imageUploadBox'); 
        if (tokenImageInput && imagePreview && uploadText && imageUploadBox ) {
            const handleFileDisplayAndUpdateState = function(file) { 
                if (file) {
                    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']; const maxSize = 5 * 1024 * 1024; 
                    if (!allowedTypes.includes(file.type.toLowerCase())) { alert('Invalid file type.'); tokenImageInput.value = ''; imageUploadedFlag = false; return; }
                    if (file.size > maxSize) { alert('File too large. Max 5MB.'); tokenImageInput.value = ''; imageUploadedFlag = false; return; }
                    const reader = new FileReader();
                    reader.onload = (e) => { imagePreview.src = e.target.result; imagePreview.style.display = 'block'; uploadText.style.display = 'none'; if(uploadIconItself) uploadIconItself.style.display = 'none'; imageUploadedFlag = true; if (imageUploadBox) imageUploadBox.style.borderColor = 'var(--surface0-color)'; if(currentFormStepGlobal === 1) updateStepperDisplay(); } 
                    reader.onerror = (e) => { console.error("FileReader error:", e); alert("Error reading file."); imageUploadedFlag = false; }
                    reader.readAsDataURL(file);
                } else { imagePreview.src = '#'; imagePreview.style.display = 'none'; uploadText.style.display = 'inline'; if(uploadIconItself) uploadIconItself.style.display = 'block'; imageUploadedFlag = false; if(currentFormStepGlobal === 1) updateStepperDisplay(); } 
            };
            tokenImageInput.addEventListener('change', (event) => { if (event.target.files && event.target.files.length > 0) handleFileDisplayAndUpdateState(event.target.files[0]); else handleFileDisplayAndUpdateState(null); });
            imageUploadBox.addEventListener('click', () => tokenImageInput.click());
            imageUploadBox.addEventListener('dragover', (e) => { e.preventDefault(); imageUploadBox.style.borderColor = 'var(--primary-accent)'; });
            imageUploadBox.addEventListener('dragleave', (e) => { e.preventDefault(); if (!imageUploadedFlag) imageUploadBox.style.borderColor = 'var(--surface0-color)';});
            imageUploadBox.addEventListener('drop', (e) => { e.preventDefault(); imageUploadBox.style.borderColor = 'var(--surface0-color)'; if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { tokenImageInput.files = e.dataTransfer.files; handleFileDisplayAndUpdateState(e.dataTransfer.files[0]); } });
        } else { console.error("CRITICAL: Image upload elements missing from DOM."); }
        updateStepperDisplay(); 
        if (currentFormStepGlobal === 3) updateTotalMintCostAndReview();
    } 
    
    function populateCreateLiquidityTokenSelect() {
        const lpTokenSelect = document.getElementById('lpTokenSelect');
        if (!lpTokenSelect) return;
        const userTokens = JSON.parse(localStorage.getItem(CREATED_TOKENS_STORAGE_KEY)) || [];
        lpTokenSelect.innerHTML = '<option value="">-- Choose your token --</option>';
        if (userTokens.length > 0) {
            userTokens.forEach(token => {
                const option = document.createElement('option');
                option.value = token.id; 
                option.textContent = `${token.name} (${token.symbol})`;
                lpTokenSelect.appendChild(option);
            });
        }
    }

    function displayUserLiquidityPools() {
        const poolsListDiv = document.getElementById('userLiquidityPoolsList');
        if (!poolsListDiv) return;
        const userLPs = JSON.parse(localStorage.getItem(USER_LIQUIDITY_POOLS_KEY)) || [];
        const emptyStateDiv = poolsListDiv.querySelector('#lp-empty-state');

        if (userLPs.length > 0) {
            if (emptyStateDiv) emptyStateDiv.style.display = 'none';
            poolsListDiv.querySelectorAll('.liquidity-pool-item').forEach(item => item.remove());
            userLPs.slice().reverse().forEach(lp => {
                const poolItem = document.createElement('div');
                poolItem.className = 'liquidity-pool-item fade-in-section';
                const placeholderImg = 'placeholder-coin-1.png'; 
                const imgSrc = (lp.tokenImageSrc && lp.tokenImageSrc !== '#' && !lp.tokenImageSrc.endsWith(window.location.pathname)) ? lp.tokenImageSrc : placeholderImg;

                poolItem.innerHTML = `
                    <img src="${imgSrc}" alt="${lp.tokenName}" class="lp-token-image" onerror="this.onerror=null;this.src='${placeholderImg}';">
                    <h4 class="lp-token-name">${lp.tokenName} <span>(${lp.tokenSymbol})</span></h4>
                    <p class="lp-amounts"><strong>${lp.baseAmount} ${lp.tokenSymbol}</strong> / <strong>${lp.quoteAmount} ${lp.quoteSymbol}</strong></p>
                    <p class="lp-creation-date">Created: ${new Date(lp.creationDate).toLocaleString()}</p>
                    <button class="btn btn-danger btn-sm lp-remove-button" data-lpid="${lp.id}" data-lpname="${lp.tokenName}">
                        <i data-feather="minus-circle"></i> Remove Liquidity
                    </button>
                `;
                poolsListDiv.appendChild(poolItem);
                const removeBtn = poolItem.querySelector('.lp-remove-button');
                if(removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        const lpIdToRemove = this.dataset.lpid;
                        const lpNameToRemove = this.dataset.lpname;
                        openConfirmRemoveLpModal(lpIdToRemove, lpNameToRemove);
                    });
                }
            });
            feather.replace();
            poolsListDiv.querySelectorAll('.liquidity-pool-item.fade-in-section').forEach(el => observer.observe(el));
        } else {
            poolsListDiv.querySelectorAll('.liquidity-pool-item').forEach(item => item.remove());
            if (emptyStateDiv) emptyStateDiv.style.display = 'flex';
            else {
                if (poolsListDiv) { // Check if poolsListDiv still exists
                   poolsListDiv.innerHTML = `<div class="empty-state" id="lp-empty-state" style="display: flex;"><i data-feather="info"></i><p>No active liquidity pools found for your tokens.</p><p>Create one above to get started!</p></div>`;
                   feather.replace();
                }
            }
        }
    }

    // Page Specific Logic
    const pagePath = currentLocation.trim(); 
    if (pagePath.includes('create-token.html')) {
        if (!window.tokenFormInitialized) { 
             initializeTokenCreationForm();
             window.tokenFormInitialized = true;
        }
        initializePaymentModal(); 
        const mintButton = document.getElementById('mintButton');
        if(mintButton) {
            mintButton.addEventListener('click', () => {
                openPaymentModal('mintNew', currentTotalMintCost);
            });
        }
    } else if (pagePath.includes('trending-coins.html')) {
        // For "Coming Soon" page, payment modal might not be needed unless there's another action.
        // If initializePaymentModal() is called, it will look for elements that might not exist.
        // For now, we'll leave it to potentially initialize if other modals are used on the page.
        // If trending-coins.html *only* has "coming soon" and no modals, this could be removed.
        initializePaymentModal(); 
        initializeTrendingCoinsPage(); 
    } else if (pagePath.includes('create-liquidity.html')) {
        initializePaymentModal();
        initializeConfirmRemoveLpModal(); 
        const createLpButton = document.getElementById('createLpButton');
        if (createLpButton) {
            createLpButton.addEventListener('click', () => {
                const lpTokenSelect = document.getElementById('lpTokenSelect');
                if (!lpTokenSelect || !lpTokenSelect.value) { alert("Please select a token first."); return; }
                const baseTokenAmountInput = document.getElementById('baseTokenAmount');
                const quoteTokenAmountInput = document.getElementById('quoteTokenAmount');
                const baseTokenAmount = baseTokenAmountInput.value;
                const quoteTokenAmount = quoteTokenAmountInput.value;

                if (!baseTokenAmount || !quoteTokenAmount || parseFloat(baseTokenAmount) <= 0 || parseFloat(quoteTokenAmount) < 0) { 
                    alert("Please enter valid amounts for both tokens. SOL amount can be 0 if you only wish to pay the service fee on top of your token amount."); return;
                }
                const serviceFee = 0.2; // UPDATED SERVICE FEE FOR LP
                openPaymentModal('createLP', serviceFee); 
            });
        }
        populateCreateLiquidityTokenSelect(); 
        displayUserLiquidityPools();
        const refreshPoolsBtn = document.getElementById('refreshPoolsButton');
        if(refreshPoolsBtn) refreshPoolsBtn.addEventListener('click', displayUserLiquidityPools);

    } else if (pagePath === 'index.html' || pagePath === '') { // Added empty string for root path
        const dynamicCostHowTo = document.getElementById('dynamicCostHowTo');
        if (dynamicCostHowTo) dynamicCostHowTo.textContent = '0.1 SOL'; // UPDATED COST
    }

    // Other Global Inits
    function populateReviewDetails() { 
        const form = document.getElementById('token-creation-form');
        if (!form) return;
        const tokenNameEl = form.querySelector('#tokenName'); 
        const reviewNameEl = form.querySelector('#reviewName'); 
        if (tokenNameEl && reviewNameEl) reviewNameEl.textContent = tokenNameEl.value || 'N/A'; 
        const tokenSymbolEl = form.querySelector('#tokenSymbol'); 
        const reviewSymbolEl = form.querySelector('#reviewSymbol'); 
        if (tokenSymbolEl && reviewSymbolEl) reviewSymbolEl.textContent = tokenSymbolEl.value.toUpperCase() || 'N/A'; 
        const tokenDecimalsEl = form.querySelector('#tokenDecimals'); 
        const reviewDecimalsEl = form.querySelector('#reviewDecimals'); 
        if (tokenDecimalsEl && reviewDecimalsEl) reviewDecimalsEl.textContent = tokenDecimalsEl.value || 'N/A'; 
        const tokenSupplyEl = form.querySelector('#tokenSupply'); 
        const reviewSupplyEl = form.querySelector('#reviewSupply'); 
        if (tokenSupplyEl && reviewSupplyEl) reviewSupplyEl.textContent = tokenSupplyEl.value ? Number(tokenSupplyEl.value).toLocaleString() : 'N/A'; 
        const tokenDescriptionEl = form.querySelector('#tokenDescription'); 
        const reviewDescriptionEl = form.querySelector('#reviewDescription'); 
        if (tokenDescriptionEl && reviewDescriptionEl) reviewDescriptionEl.textContent = tokenDescriptionEl.value || 'Not provided'; 
        const imagePreviewEl = form.querySelector('#imagePreview'); 
        const reviewImageEl = form.querySelector('#reviewImage'); 
        if (imagePreviewEl && reviewImageEl) { 
            const imageSrc = imagePreviewEl.src; 
            if (imageSrc && !imageSrc.endsWith('#') && imagePreviewEl.style.display !== 'none' && !imageSrc.endsWith(window.location.pathname)) {
                reviewImageEl.src = imageSrc; reviewImageEl.style.display = 'block'; 
            } else { reviewImageEl.style.display = 'none'; } 
        }
    }
    const faqItems = document.querySelectorAll('.faq-item details'); 
    if (faqItems.length > 0) { faqItems.forEach(details => { details.addEventListener('toggle', function() {}); }); }
    const logoImg = document.getElementById('logo-img'); 
    if(logoImg) { 
        const primaryAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim(); 
        const baseBgColor = getComputedStyle(document.documentElement).getPropertyValue('--base-bg').trim(); 
        const skyColor = getComputedStyle(document.documentElement).getPropertyValue('--mocha-sky').trim(); 
        logoImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="35" height="35"><defs><linearGradient id="gradLogo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${skyColor};stop-opacity:1" /><stop offset="100%" style="stop-color:${primaryAccentColor};stop-opacity:1" /></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23gradLogo)" /><text x="50" y="65" font-family="Poppins, sans-serif" font-size="45" font-weight="bold" fill="${baseBgColor}" text-anchor="middle">A</text></svg>`; 
    }

});
