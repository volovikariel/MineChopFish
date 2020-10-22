const robot = require("robotjs");

while(true) {
    robot.typeStringDelayed("\nyui mine", Math.floor((Math.random() * 50)) + 200);
    robot.keyTap("enter");

    robot.typeString("yui fish");
    robot.keyTap("enter");

    robot.typeString("yui chop");
    robot.keyTap("enter");
}
