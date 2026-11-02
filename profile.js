// ═══════════════════════════════════════
// PROFILE PANEL
// ═══════════════════════════════════════
function toggleProfile() {
  document.getElementById('profilePanel').classList.toggle('open');
  document.getElementById('profileVeil').classList.toggle('open');
}

async function showPurchases() {
  toggleProfile();
  const cu = window.currentUser_ref ? window.currentUser_ref() : null;
  if (!cu || !cu.email) { window.toast && window.toast("Sign in to view your purchases ✿"); return; }
  const purchases = await window.getUserPurchases(cu.email);
  if (purchases.length === 0) {
    window.toast && window.toast("No purchases recorded yet ✿");
    return;
  }
  showProfileModal(
    "🛍 Your Purchases",
    purchases.map(p => `<div style="padding:12px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text);">✿ ${p}</div>`).join('')
  );
}

async function showMyReviews() {
  toggleProfile();
  const cu = window.currentUser_ref ? window.currentUser_ref() : null;
  if (!cu || !cu.email) { window.toast && window.toast("Sign in to view your reviews ✿"); return; }
  const db = window.db;
  const q = window.query(window.collection(db, 'reviews'), window.where('email', '==', cu.email));
  const snap = await window.getDocs(q);
  if (snap.empty) {
    window.toast && window.toast("You haven't left any reviews yet ✿");
    return;
  }
  const rows = [];
  snap.forEach(d => {
    const r = d.data();
    rows.push(`<div style="padding:14px 0;border-bottom:1px solid var(--border);">
      <div style="font-size:12px;color:var(--gold);margin-bottom:4px;">${r.product}</div>
      <div style="color:#F4A261;font-size:14px;margin-bottom:4px;">${window.starsToDisplay ? window.starsToDisplay(r.rating) : r.rating}</div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;">"${r.review}"</div>
    </div>`);
  });
  showProfileModal("✿ My Reviews", rows.join(''));
}

function showProfileModal(title, bodyHtml) {
  let modal = document.getElementById('profileInfoModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profileInfoModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(74,55,40,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;';
    modal.innerHTML = `<div style="background:var(--ivory);width:100%;max-width:480px;border-radius:24px 24px 0 0;padding:28px 24px 40px;max-height:70vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h3 id="profileModalTitle" style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--text);"></h3>
        <button onclick="document.getElementById('profileInfoModal').remove()" style="background:none;border:none;font-size:22px;color:var(--text-light);cursor:pointer;">×</button>
      </div>
      <div id="profileModalBody"></div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }
  document.getElementById('profileModalTitle').textContent = title;
  document.getElementById('profileModalBody').innerHTML = bodyHtml;
}

function confirmLogout() {
  toggleProfile();
  document.getElementById('logoutConfirm').classList.add('open');
}

function closeLoginWall() {
  document.getElementById('loginWall').classList.remove('open');
}

// Expose to global scope
window.toggleProfile = toggleProfile;
window.showPurchases = showPurchases;
window.showMyReviews = showMyReviews;
window.confirmLogout = confirmLogout;
window.closeLoginWall = closeLoginWall;
