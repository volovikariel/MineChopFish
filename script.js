const path = require('path');
const { 
    app,
    Tray,
    Menu,
    globalShortcut,
    nativeImage
} = require('electron');
const robot = require("robotjs");
const cp = require('child_process');
process.on('message', (n) => {console.log(n)});


let children = [];

robot.setKeyboardDelay(0);

let tray = null
let contextMenu = null;
app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, './aww.png')); 
    tray.setToolTip('Yui chan!')
    contextMenu = Menu.buildFromTemplate([ {
        label: 'running',
        type: 'checkbox',
        checked: false, 
        click() { 
            handleChildren(true); 
            // Hide the tray because the key typing could bug out with spamming it on and off 
            tray.closeContextMenu(); 
        },
    } ])

    tray.setContextMenu(contextMenu)
 
    globalShortcut.register('CmdOrCtrl+0', () => {
        handleChildren();
    });

    globalShortcut.register('CmdOrCtrl+shift+0', () => {
        process.exit();
    });
})

function handleChildren(clicked = false) {
       // Toggle checked
       // If it was clicked, they manually checked it so don't check it again
       if(!clicked) {
           contextMenu.items[0].checked = !contextMenu.items[0].checked;
       }
       
       // Should display on windows
       tray.displayBalloon({
           icon: nativeImage.createFromPath(path.join(__dirname, '.')),
           title: "Toggled",
           content: "Toggled typing"
       });

       // If children already exist, kill
       if(children.length > 0) {
           killChildren();
       }

       if(contextMenu.items[0].checked) {
           // Add a new child if it's checked 
           let child = cp.fork(path.join(__dirname, 'worker.js'));
           children.push(child);
       }
       else {
           // If children already exist, kill
           if(children.length > 0) {
               killChildren();
           }
       }
}

function killChildren() {
      for(let i = 0; i < children.length; i++) {
          children.pop().kill("SIGHUP");
      }
}

process.on('exit', () => {
    killChildren();
});

// If user CTRL+C, handle it like a standard shutdown
process.on('SIGINT', () => {
    process.exit()
});
