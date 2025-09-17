(function () {
  const choices = ['rock','paper','scissors'];
  const choiceEls = document.querySelectorAll('.choice');
  const scoreYouEl = document.getElementById('scoreYou');
  const scoreCompEl = document.getElementById('scoreComp');
  const scoreDrawEl = document.getElementById('scoreDraw');
  const roundSummaryEl = document.getElementById('roundSummary');
  const youPickEl = document.getElementById('youPick');
  const compPickEl = document.getElementById('compPick');
  const resetBtn = document.getElementById('resetBtn');
  const layoutIndicator = document.getElementById('layoutIndicator');

  const SKEY = 'rps_scores_v2';
  let scores = { you:0, comp:0, draw:0 };

  function loadScores(){
    try {
      const raw = localStorage.getItem(SKEY);
      if (raw) scores = JSON.parse(raw);
    } catch(e){}
    renderScores();
  }
  function saveScores(){ localStorage.setItem(SKEY, JSON.stringify(scores)); }
  function renderScores(){
    scoreYouEl.textContent = scores.you;
    scoreCompEl.textContent = scores.comp;
    scoreDrawEl.textContent = scores.draw;
  }

  function computerPick(){
    return choices[Math.floor(Math.random()*choices.length)];
  }
  function resolveRound(you, comp){
    if (you === comp) return 'draw';
    if (
      (you === 'rock' && comp === 'scissors') ||
      (you === 'paper' && comp === 'rock') ||
      (you === 'scissors' && comp === 'paper')
    ) return 'you';
    return 'comp';
  }

  function showRound(you, comp, outcome){
    choiceEls.forEach(btn=>{
      btn.classList.remove('selected');
      btn.setAttribute('aria-checked','false');
    });
    const chosenBtn = document.querySelector(`.choice[data-choice="${you}"]`);
    if (chosenBtn){
      chosenBtn.classList.add('selected');
      chosenBtn.setAttribute('aria-checked','true');
    }

    youPickEl.innerHTML = symbolFor(you);
    compPickEl.innerHTML = symbolFor(comp);

    youPickEl.className = 'pick';
    compPickEl.className = 'pick';

    if (outcome === 'you'){
      youPickEl.classList.add('win');
      compPickEl.classList.add('lose');
      roundSummaryEl.textContent = 'You win';
    } else if (outcome === 'comp'){
      youPickEl.classList.add('lose');
      compPickEl.classList.add('win');
      roundSummaryEl.textContent = 'Computer wins';
    } else {
      youPickEl.classList.add('draw');
      compPickEl.classList.add('draw');
      roundSummaryEl.textContent = "It's a draw";
    }

    renderScores();
  }

  function symbolFor(choice){
    return `<img src="images/${choice}.svg" alt="${choice}" class="choice-img small" />`;
  }

  function play(youChoice){
    const compChoice = computerPick();
    const outcome = resolveRound(youChoice, compChoice);
    if (outcome === 'you') scores.you++;
    else if (outcome === 'comp') scores.comp++;
    else scores.draw++;
    saveScores();
    showRound(youChoice, compChoice, outcome);
  }

  choiceEls.forEach(btn=>{
    btn.addEventListener('click', ()=> play(btn.dataset.choice));
    btn.addEventListener('keydown', (ev)=>{
      if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); btn.click(); }
    });
  });

  resetBtn.addEventListener('click', ()=>{
    if (confirm('Reset scores?')){
      scores = { you:0, comp:0, draw:0 };
      saveScores();
      renderScores();
      roundSummaryEl.textContent = 'Scores reset. Start a new match!';
      youPickEl.textContent = '—';
      compPickEl.textContent = '—';
      choiceEls.forEach(b=>b.classList.remove('selected'));
    }
  });

  function setLayoutIndicator(){
    const mq = window.matchMedia('(min-width:720px)');
    layoutIndicator.textContent = mq.matches ? 'Desktop' : 'Mobile';
  }
  window.addEventListener('resize', setLayoutIndicator);

  loadScores();
  setLayoutIndicator();
})();

