module.exports = {
    "walking.set": (player, index) => {
        var walkings = [null, "move_m@brave", "move_m@confident", "move_m@shadyped@a", "move_m@quick", "move_m@sad@a", "move_m@fat@a"];
        index = Math.clamp(index, 0, walkings.length - 1);
        player.setVariable("walking", walkings[index]);
    },
};
