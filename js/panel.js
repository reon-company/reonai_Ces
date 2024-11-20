function showPanel(panelId) {
  console.log(`showPanel called with panelId: ${panelId}`);
  const panels = [
    'mainPanel',
    'roastPanel',
    'roastInfoPanel',
    'recipePanel',
    'puttingCountPanel',
    'easyRoastInfoPanel',
    'easyRoastPanel',
    'settingPanel',
    'signInPanel',
  ];

  panels.forEach((id) => {
    const panel = document.getElementById(id);
    if (panel) {
      if (id === panelId) {
        panel.style.display = 'block';
        panel.classList.add('show');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('show');
      }
    } else {
      console.log(`Panel not found: ${id}`);
    }
  });
}

function headerDisplayNone() {
  document.getElementById('topHeader').classList.add('hidden');
  document.getElementById('sideHeader').classList.add('hidden');
}

function headerDisplayBlock() {
  document.getElementById('topHeader').classList.remove('hidden');
  document.getElementById('sideHeader').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  showPanel('mainPanel');
});
